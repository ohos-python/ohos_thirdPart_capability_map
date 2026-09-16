import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {classify} from './classify.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../..');
const read=async n=>JSON.parse(await fs.readFile(path.join(dir,n),'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
export const family=n=>n.toLowerCase().replace(/@\d[\w.-]*$/,'');
export function homepage(s){try{const u=new URL(s);let p=u.pathname.replace(/\/+$/,'').replace(/\.git$/,'');if(u.hostname==='github.com')p='/'+p.split('/').filter(Boolean).slice(0,2).join('/').toLowerCase();if((!p||p==='/')&&['github.com','sourceforge.net','www.gnu.org'].includes(u.hostname))return '';return u.hostname.replace(/^www\./,'')+p;}catch{return '';}}
// Explicit package identities, not a blanket shared-homepage merge. The pair must
// also have the same project host. Components such as qtbase/python-tk stay separate.
const identityAliases={sqlite:'sqlite3',xz:'xz_utils',node:'nodejs',python:'cpython',llvm:'llvm-core',curl:'libcurl'};
export function brewEvidence(p,conanHit){
 if(conanHit)return 'ConanCenter目录交叉证据';
 if(/\bC\+\+|\bC\s*(?:\/\s*C\+\+)?\s+librar|librar(?:y|ies)\s+for\s+C\b|written in C\b/i.test(p.description||''))return '官方描述明确C/C++';
 const builds=p.build_dependencies||[],native=builds.some(n=>/^(cmake|meson|autoconf|automake|libtool|gcc|ninja)$/.test(n));
 const other=builds.some(n=>/^(go|rust|cargo|node|python(?:@.*)?|ruby(?:@.*)?)$/.test(n));
 if(native&&!other&&/\blibrar(?:y|ies)\b|\bframework\b/i.test(p.description||''))return '官方描述为库/框架且具有原生构建依赖（候选，需复核）';
 return null;
}
const blank=()=>({packages:0,matchedPackages:0,knownDownloads:0,missingDownloads:0,totalDownloads:0,matchedDownloads:0});
export function summarizeNative(rows,categories){
 const cats=categories.map(c=>({id:c.id,label:c.label,...blank()})),map=new Map(cats.map(c=>[c.id,c])),total=blank();
 for(const r of rows){for(const b of [total,map.get(r.categoryId)]){assert(b);b.packages++;if(r.matched)b.matchedPackages++;if(r.downloads===null)b.missingDownloads++;else {b.knownDownloads++;b.totalDownloads+=r.downloads;if(r.matched)b.matchedDownloads+=r.downloads;}}}
 for(const b of [total,...cats]){b.packageCoverage=b.packages?b.matchedPackages/b.packages:null;b.downloadCoverage=b.totalDownloads?b.matchedDownloads/b.totalDownloads:null;b.downloadStatus=!b.knownDownloads?'unavailable':b.missingDownloads?'partial':'complete';}
 return {total,categories:cats};
}
export async function buildNative(){
 const [conan,brew,installs]=await Promise.all([read('conan-registry.json'),read('homebrew-formulae.json'),read('homebrew-core-install-30d.json')]);
 const rawCatalog=await fs.readFile(path.join(root,'c-library-capabilities.js'));const ctx={window:{}};vm.runInNewContext(rawCatalog.toString('utf8'),ctx);const cat=ctx.window.HARMONY_C_CATALOG;
 const supported=new Map(cat.libraries.map(r=>[r.name.toLowerCase(),r]));
 const conanMap=new Map(conan.packages.map(p=>[p.name,p]));const homes=new Map();
 for(const p of conan.packages){const h=homepage(p.homepage);if(h){const list=homes.get(h)||[];list.push(p.name);homes.set(h,list);}}
 const entities=new Map(conan.packages.map(p=>[p.name,{name:p.name,conan:p,brew:[],mergeEvidence:[]} ]));
 const excluded=[],included=[],ambiguous=[];
 for(const p of brew.packages){
  const aliases=[p.name,...p.aliases||[],...p.oldnames||[]].map(family);
  const exact=[...new Set(aliases.filter(n=>conanMap.has(n)))];
  const h=homes.get(homepage(p.homepage))||[];
  const alias=identityAliases[family(p.name)];
  const sameHost=(a,b)=>{try{return new URL(a).hostname.replace(/^www\./,'')===new URL(b).hostname.replace(/^www\./,'');}catch{return false;}};
  const reviewed=alias&&conanMap.has(alias)&&sameHost(p.homepage,conanMap.get(alias).homepage)?alias:null;
  let matches=exact.length?exact:reviewed?[reviewed]:[];
  // Do not merge identically named packages that point at different GitHub projects.
  matches=matches.filter(n=>{const a=homepage(p.homepage),b=homepage(conanMap.get(n).homepage);return !(a.startsWith('github.com/')&&b.startsWith('github.com/')&&a!==b);});
  const conanName=matches.length===1?matches[0]:null;
  const evidence=brewEvidence(p,conanName)||(h.length===1?'同属Conan原生项目的组件候选（不等同同一包）':null);
  if(!evidence){excluded.push({name:p.name,platform:'homebrew',reason:'未取得独立的C/C++或原生库证据；不能因已在鸿蒙目录就纳入',description:p.description});continue;}
  let key=conanName||family(p.name);
  if(!conanName&&entities.has(key)&&entities.get(key).conan){ambiguous.push({name:p.name,reason:'同名但跨平台身份不一致，暂不合并'});key='homebrew:'+key;}
  if(matches.length>1)ambiguous.push({name:p.name,candidates:matches,reason:'多个Conan候选，不自动合并'});
  if(!entities.has(key))entities.set(key,{name:key,conan:null,brew:[],mergeEvidence:[]});
  const entity=entities.get(key);entity.brew.push(p);entity.mergeEvidence.push({formula:p.name,basis:conanName?(exact.includes(conanName)?'同名/官方别名 + @版本族归一':'显式跨平台名称映射 + 项目主机一致'):'Homebrew @版本族归一',scopeEvidence:evidence});
  included.push(p.name);
 }
 const analytics=installs.data,counts=new Map(),rawRows=[];
 for(const [name,variants] of Object.entries(analytics.formulae||{})){
  let count=0;for(const v of variants){const n=Number(String(v.count).replace(/,/g,''));assert(Number.isSafeInteger(n)&&n>=0);count+=n;rawRows.push(v);}counts.set(name,count);
 }
 const observedCoreInstalls=rawRows.reduce((s,r)=>s+Number(String(r.count).replace(/,/g,'')),0),sourceTotalDifference=analytics.total_count-observedCoreInstalls;
 // Record an upstream aggregate/detail discrepancy; never invent balancing events.
 const rows=[];
 for(const e of entities.values()){
  const candidates=[e.conan?.name,...e.brew.flatMap(p=>[p.name,...p.aliases||[],...p.oldnames||[]])].filter(Boolean);
  let hitName=candidates.find(n=>supported.has(n.toLowerCase())),matchBasis='目录同名/来源显式名称命中';
  if(!hitName){hitName=candidates.map(family).find(n=>supported.has(n));matchBasis='包族/官方别名命中，不核验具体版本';}
  const hit=hitName?supported.get(hitName.toLowerCase()):null;
  const p=e.conan||{...e.brew[0],name:family(e.brew[0].name)};
  const classification=classify('cpp',{...p,keywords:Array.isArray(p.keywords)?p.keywords:[]},hit);
  const formulas=e.brew.map(b=>({name:b.name,installs:counts.has(b.name)?counts.get(b.name):null,sourceUrl:`https://formulae.brew.sh/formula/${encodeURIComponent(b.name)}`}));
  const known=formulas.filter(f=>f.installs!==null);
  rows.push({name:e.name,description:p.description||'',categoryId:classification.id,classification:classification.confidence,classificationBasis:classification.basis,matched:!!hit,catalogName:hit?.name||null,matchBasis:hit?matchBasis:'当前目录未检出；其他别名/版本仍待核验',downloads:known.length?known.reduce((s,f)=>s+f.installs,0):null,sourceUrl:p.sourceUrl||formulas[0]?.sourceUrl,platforms:[...(e.conan?['conan']:[]),...(e.brew.length?['homebrew']:[])],conanUrl:e.conan?.sourceUrl||null,homebrewFormulae:formulas,missingFormulaCounts:formulas.length-known.length,mergeEvidence:e.mergeEvidence});
 }
 rows.sort((a,b)=>a.name.localeCompare(b.name));assert.equal(new Set(rows.map(r=>r.name)).size,rows.length);
 const summary=summarizeNative(rows,cat.categories);
 const conanSource=await read('conan-popular-downloads.json');
 const downloadMap=new Map(conanSource.rows.map(r=>[r.name,r.downloads]));
 for(const r of rows)r.conanDownloads=r.platforms.includes('conan')?(downloadMap.get(r.name)??null):null;
 const conanDownloadRows=conanSource.rows.map(r=>{const row=rows.find(p=>p.platforms.includes('conan')&&p.name===r.name);return {...r,matched:row?.matched??null,categoryId:row?.categoryId??null,inDenominator:!!row};});
 const conanDownloads={...conanSource,rows:conanDownloadRows,knownPackages:rows.filter(r=>r.conanDownloads!==null).length,totalPackages:conan.packages.length,totalObserved:conanSource.rows.reduce((s,r)=>s+r.downloads,0),fullCoverage:null};
 const platform=(id,label)=>({id,label,...summarizeNative(rows.filter(r=>r.platforms.includes(id)).map(r=>id==='conan'?{...r,downloads:null}:r),cat.categories).total});
 let baseline=null;
 const oldPath=path.join(dir,'cpp-vcpkg-baseline.json');
 try{baseline=JSON.parse(await fs.readFile(oldPath,'utf8'));}catch(err){if(err.code!=='ENOENT')throw err;try{const old=await read('cpp-coverage-data.json');if(old.denominator.kind==='vcpkg-registry'){await fs.copyFile(path.join(dir,'cpp-coverage-data.json'),oldPath);baseline=old;}}catch(err){if(err.code!=='ENOENT')throw err;}}
 const hashes=await Promise.all(['conan-registry.json','homebrew-formulae.json','homebrew-core-install-30d.json','conan-popular-downloads.json'].map(async file=>({label:file,file:'outputs/ecosystem-coverage-20260916/'+file,sha256:sha(await fs.readFile(path.join(dir,file)))})));
 const missingFormulaCounts=rows.reduce((s,r)=>s+r.missingFormulaCounts,0);
 const result={schemaVersion:1,ecosystem:'cpp',title:'C/C++ · ConanCenter × Homebrew',scope:'ConanCenter + Homebrew原生库候选 · 包族去重目录',weightLabel:'Homebrew安装量（独立代理指标）',weightKind:'homebrew-installs',generatedAt:new Date().toISOString(),window:`Homebrew官方30d窗口：${analytics.start_date} — ${analytics.end_date}（按API原样展示，非npm窗口）`,catalog:{unique:supported.size},
  denominator:{kind:'conan-homebrew-union',inputCandidates:conan.packages.length+brew.packages.length,excluded:excluded.length,conanRecipes:conan.packages.length,homebrewAll:brew.packages.length,homebrewIncludedFormulae:included.length,homebrewExcluded:excluded.length,mergedRecords:conan.packages.length+included.length-rows.length,conanCommit:conan.commit,definition:'ConanCenter配方包族与有独立C/C++/原生库证据的Homebrew formulae取并集；同名、官方别名、显式名称映射及@版本族归一。不因主页相同就合并子模块；保留原生开发工具/运行时，其他应用不混入。',top50kAvailable:false},
  heat:{source:'Homebrew/core formula_install',start:analytics.start_date,end:analytics.end_date,allCoreInstalls:analytics.total_count,observedCoreInstalls,sourceTotalDifference,includedFormulae:included.length,reportedFormulae:included.length-missingFormulaCounts,missingFormulaCounts,definition:'仅已纳入、且官方安装榜有记录的Homebrew formulae计数（包括HEAD等选项）。Conan-only包安装量为null；未上榜不推断为0。'},
  conanDownloads,platformSummaries:[platform('conan','ConanCenter 包族'),platform('homebrew','Homebrew 入选包族')],vcpkgBaseline:baseline?{...baseline.total,label:'vcpkg 历史同名对照',commit:baseline.denominator.commit}:null,
  limitations:['目录命中不等于版本、架构、安装或鸿蒙真机端到端验证。','Homebrew是跨语言平台；仅入选C/C++明确描述、Conan交叉证据，或库/框架描述加原生构建依赖的候选。后者仍需逐库复核；不代表所有Homebrew原生库均已识别。','数量分母为两个平台去重后的包族，安装量分母仅来自其中Homebrew有统计的子集；不可把这一权重解释成Conan下载覆盖或全C/C++生态覆盖。','Homebrew统计来自参与匿名遥测的安装，涵盖macOS/Linux，不是鸿蒙实际使用、全体用户或完整下载量；统计窗口不同于Python/npm。','同一formula的选项/HEAD记录先加总，同一包族的版本化formula再汇总；这是安装事件的加总，不是独立用户去重。','未出现在安装榜的formula保留null而非0；部分包族若有成员缺失，只汇总已观测成员。','同名/别名与版本族归一仍可能存在粒度和身份误差；多个候选或不同GitHub项目不强行合并，歧义清单保存在导出数据。','现有鸿蒙制品仓downloads不参加此安装量计算；ConanCenter尚无可比下载量，Conan-only行保持空值。','沿用首页21个标签，规则与现有目录分类为阶段结果；其他/待确认保留。'],
  fieldSemantics:'为复用页面汇总结构，downloads/totalDownloads/matchedDownloads在本数据集专指Homebrew安装事件，不是Conan或鸿蒙下载；以weightKind=homebrew-installs为准。',identityAliases,
  sources:[{label:'ConanCenter固定版本配方',url:`https://github.com/conan-io/conan-center-index/tree/${conan.commit}/recipes`},{label:'Homebrew包目录API',url:brew.url},{label:'Homebrew/core 30d安装统计',url:installs.url},{label:'Homebrew匿名统计口径',url:'https://docs.brew.sh/Analytics'},...hashes,{label:'鸿蒙C/C++目录',file:'c-library-capabilities.js',sha256:sha(rawCatalog)}],excluded,ambiguities:ambiguous,rows,...summary};
 result.limitations=result.limitations.map(s=>s.startsWith('现有鸿蒙制品仓downloads')?'Conan官网热门榜提供部分库的total_downloads，统计窗口未说明；仅独立展示，不与Homebrew安装量相加，也不据此计算全量下载覆盖率。配方详情中的downloads=0与热门榜冲突，未当作真实零值采用。现有鸿蒙制品仓downloads不参加计算。':s);
 result.fieldSemantics+=' Conan真实下载计数另存conanDownloads，未知为null；统计窗口未确认。';
 result.sources.push({label:'Conan官方热门榜下载计数（SSR total_downloads，窗口未说明）',url:conanSource.url});
 await fs.writeFile(path.join(dir,'cpp-coverage-data.json'),JSON.stringify(result,null,2)+'\n');
 await fs.writeFile(path.join(root,'cpp-coverage-data.js'),'window.ECOSYSTEM_COVERAGE_DATA = '+JSON.stringify(result).replace(/</g,'\\u003c')+';\n');
 console.log(JSON.stringify({denominator:result.denominator,total:result.total,heat:result.heat,platforms:result.platformSummaries,ambiguities:ambiguous.length}));return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildNative();
