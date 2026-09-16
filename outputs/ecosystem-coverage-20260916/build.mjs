import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {classify,nodeCategories} from './classify.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../..'),parent=path.dirname(root);
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=async file=>JSON.parse(await fs.readFile(path.join(dir,file),'utf8'));
const readJs=async file=>{const bytes=await fs.readFile(path.join(root,file));const c={window:{}};vm.runInNewContext(bytes.toString('utf8'),c);return {data:Object.values(c.window)[0],sha256:sha(bytes)};};
const save=(file,obj)=>fs.writeFile(path.join(dir,file),JSON.stringify(obj,null,2)+'\n');
const blank=()=>({packages:0,matchedPackages:0,knownDownloads:0,missingDownloads:0,totalDownloads:0,matchedDownloads:0});
export function summarize(rows,categories){
 const buckets=categories.map(([id,label])=>({id,label,...blank()}));const by=new Map(buckets.map(b=>[b.id,b]));const total=blank();
 for(const r of rows){assert(by.has(r.categoryId));for(const b of [total,by.get(r.categoryId)]){b.packages++;if(r.matched)b.matchedPackages++;if(r.downloads===null)b.missingDownloads++;else{assert(Number.isSafeInteger(r.downloads)&&r.downloads>=0);b.knownDownloads++;b.totalDownloads+=r.downloads;if(r.matched)b.matchedDownloads+=r.downloads;}}}
 for(const b of [total,...buckets]){b.packageCoverage=b.packages?b.matchedPackages/b.packages:null;b.downloadCoverage=b.knownDownloads&&b.totalDownloads?b.matchedDownloads/b.totalDownloads:null;b.downloadStatus=b.knownDownloads===0?'unavailable':b.missingDownloads?'partial':'complete';}
 for(const key of Object.keys(blank()))assert.equal(buckets.reduce((n,b)=>n+b[key],0),total[key]);
 return {total,categories:buckets};
}
const shared=['目录包名命中，不核验版本、操作系统/架构、安装、核心功能或鸿蒙真机端到端；不是整个开发领域的场景完成度。','一个包仅分配一个主标签；规则分类和现有目录标签均需复核，其他/待确认保留在分母。','下载/安装计数不是独立用户或项目数；不能与Python页直接合并成总覆盖率。'];
async function node(){
 const snap=await read('npm-downloads.json');const metadataBytes=await fs.readFile(path.join(root,'outputs/taxonomy-validation-20260912/registry-metadata.json'));
 assert.equal(sha(metadataBytes),snap.sourceSha256);
 const meta=JSON.parse(metadataBytes),all=Object.values(meta.packages).filter(r=>r.ecosystem==='JavaScript/TypeScript');
 const support=new Map(),sources=[];
 for(const name of (await fs.readdir(path.join(parent,'ohos-compatible-packages/data'))).filter(n=>n.endsWith('.jsonl')).sort()){
  const b=await fs.readFile(path.join(parent,'ohos-compatible-packages/data',name));sources.push({file:`ohos-compatible-packages/data/${name}`,sha256:sha(b)});
  for(const line of b.toString('utf8').split(/\r?\n/).filter(Boolean)){const r=JSON.parse(line);support.set(r.name,{basis:'兼容清单包名命中',catalogName:r.name});}
 }
 const compatibleUnique=support.size;
 // Use the full published catalogue, not only the small set of CI recipe folders.
 // original_name preserves scoped names; never blindly remove @ohos-ports/.
 const portBytes=await fs.readFile(path.join(parent,'ohos-ports/docs/data/packages.jsonl'));
 sources.push({file:'ohos-ports/docs/data/packages.jsonl',sha256:sha(portBytes)});
 const ports=portBytes.toString('utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
 for(const p of ports){if(!p.original_name)continue;const evidence={basis:`ohos-ports发布清单，${p.stable_version?'含稳定版':'仅Beta版'}${p.deprecated?'；已弃用需复核':''}；非全部版本运行证明`,catalogName:p.name};if(!support.has(p.original_name))support.set(p.original_name,evidence);}
 for(const name of ['electron','playwright'])support.set(name,{basis:'用户确认支持；本仓库未附真机报告',catalogName:name});
 const unique=new Map();const excluded=[];
 for(const r of all){if(r.httpStatus!==200){excluded.push({name:r.name,reason:`npm功能元数据未确认，HTTP ${r.httpStatus}；不作npm包分母`});continue;}
  const name=r.canonicalName||r.name;if(unique.has(name))continue;
  const c=classify('node',{...r,name}),hit=support.get(name);const dl=snap.records[name];
  unique.set(name,{name,description:r.description||'',categoryId:c.id,classification:c.confidence,classificationBasis:c.basis,matched:!!hit,matchBasis:hit?.basis||'当前目录未检出，不等于不支持',catalogName:hit?.catalogName||null,downloads:dl?.downloads??null,downloadSource:`https://api.npmjs.org/downloads/point/${snap.start}:${snap.end}/${encodeURIComponent(name)}`,sourceUrl:r.registryUrl,version:r.version||null});
 }
 const rows=[...unique.values()].sort((a,b)=>a.name.localeCompare(b.name));
 const result={schemaVersion:1,ecosystem:'node',title:'Node.js 项目依赖覆盖分析',scope:'现有项目依赖样本 · 非 npm 全生态 Top5万',weightLabel:'官方下载量',window:`${snap.start} — ${snap.end}（UTC，含首尾）`,generatedAt:snap.generatedAt,
  catalog:{unique:support.size,compatibleUnique,portRecords:ports.length,portMappings:new Set(ports.map(p=>p.original_name).filter(Boolean)).size,overrides:['electron','playwright']},
  denominator:{kind:'project-dependency-sample',inputCandidates:all.length,excluded:excluded.length,definition:'既有项目依赖候选中npm官方元数据HTTP200、按canonicalName去重的分发包。包含开发/构建依赖及前端包，不仅是Node.js服务端库。',top50kAvailable:false},
  limitations:[...shared,'这是项目依赖定向样本，不是npm下载Top5万，也不能外推整个npm生态覆盖率。','下载窗口与Python页相同，但统计系统及分母不同；所有版本、平台的下载均归入命中包，不是鸿蒙下载。','兼容清单上游声明采用AI自动验证且可能有误；移植发布清单（含Beta/弃用）与用户确认支持均为不同证据层级。','npm依赖名保留@scope和标点，不使用Python的PEP503归一化；移植包使用发布清单original_name显式上游映射。','未获取下载量的包仍计入数量分母；加权指标只按已取得计数的子集计算，并标注完整性。'],
  sources:[{label:'npm官方下载统计接口',url:'https://github.com/npm/registry/blob/main/docs/download-counts.md'},{label:'npm包元数据快照',file:'outputs/taxonomy-validation-20260912/registry-metadata.json',sha256:sha(metadataBytes)},{label:'本次下载快照',file:'outputs/ecosystem-coverage-20260916/npm-downloads.json',sha256:sha(await fs.readFile(path.join(dir,'npm-downloads.json')))},...sources],excluded,rows,...summarize(rows,nodeCategories)};
 await output('nodejs-coverage-data.js',result);return result;
}
async function cpp(){
 let nativeInputs=false;try{await fs.access(path.join(dir,'homebrew-formulae.json'));nativeInputs=true;}catch(e){if(e.code!=='ENOENT')throw e;}
 if(nativeInputs)return await (await import('./build-native.mjs')).buildNative();
 const snap=await read('vcpkg-registry.json'),catalog=await readJs('c-library-capabilities.js');
 const names=new Map(catalog.data.libraries.map(r=>[r.name.toLowerCase(),r]));const excluded=[];const rows=[];
 for(const p of snap.packages){
  if(p.name.startsWith('vcpkg-')){excluded.push({name:p.name,reason:'vcpkg自身构建辅助脚本，不计入三方功能库分母'});continue;}
  const hit=names.get(p.name.toLowerCase()),c=classify('cpp',p,hit);
  rows.push({name:p.name,description:p.description,categoryId:c.id,classification:c.confidence,classificationBasis:c.basis,matched:!!hit,matchBasis:hit?'C/C++目录同名精确命中':'目录未同名检出；别名/拆包待复核，不等于不支持',catalogName:hit?.name||null,downloads:null,sourceUrl:p.sourceUrl,version:p.version,supports:p.supports});
 }
 const result={schemaVersion:1,ecosystem:'cpp',title:'C/C++ 包目录覆盖分析',scope:'vcpkg 官方目录样本 · 非全生态下载榜',weightLabel:'下载量（未获取）',window:'下载统计窗口不可用；目录快照 '+snap.generatedAt.slice(0,10),generatedAt:snap.generatedAt,catalog:{unique:names.size},
  denominator:{kind:'vcpkg-registry',inputCandidates:snap.packages.length,excluded:excluded.length,commit:snap.commit,definition:'固定commit的vcpkg官方ports/vcpkg.json，剔除vcpkg-*辅助脚本；保留工具、运行时与Boost等分模块，计量单位为port而非上游项目。',top50kAvailable:false},
  limitations:[...shared,'只衡量vcpkg样本目录，不是所有C/C++库。库、工具、运行时与分模块port的粒度不完全一致。','只做不区分大小写的同名匹配，不批量去lib前缀、不把Boost整库命中外推到全部boost-*模块；别名复核可能增加命中。','当前没有这个分母的统一可比下载量，下载加权覆盖显示“待补数据”，不显示0%。','现有C/C++目录中的downloads来自鸿蒙制品仓且未固定同一窗口，不能代替全生态下载量，也不能与外部安装量混算。','vcpkg supports字段描述上游port约束，不代表已支持鸿蒙；目录存在不等于适配成功。'],
  sources:[{label:'vcpkg固定版本目录',url:`https://github.com/microsoft/vcpkg/tree/${snap.commit}/ports`},{label:'微软：包注册表定义',url:'https://learn.microsoft.com/en-us/vcpkg/concepts/registries'},{label:'vcpkg快照',file:'outputs/ecosystem-coverage-20260916/vcpkg-registry.json',sha256:sha(await fs.readFile(path.join(dir,'vcpkg-registry.json'))),archiveSha256:snap.archiveSha256},{label:'鸿蒙C/C++目录',file:'c-library-capabilities.js',sha256:catalog.sha256}],excluded,rows,...summarize(rows,catalog.data.categories.map(c=>[c.id,c.label]))};
 await output('cpp-coverage-data.js',result);return result;
}
async function output(file,result){await save(file.replace('.js','.json'),result);await fs.writeFile(path.join(root,file),'window.ECOSYSTEM_COVERAGE_DATA = '+JSON.stringify(result).replace(/</g,'\\u003c')+';\n');}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const results=await Promise.all([node(),cpp()]);
 const pct=x=>x===null?'待补数据':(x*100).toFixed(2)+'%';const n=x=>x.toLocaleString('en-US');
 const lines=['# Node.js / C/C++：数量与使用热度覆盖分析','','这是阶段结果，不是两个生态的Top5万榜单。原有Python页与V1保持不变，首页仅新增导航。',''];
 for(const r of results){
  const weight=r.weightKind==='homebrew-installs'?'Homebrew安装（子集）':'下载';
  console.log(JSON.stringify({ecosystem:r.ecosystem,catalog:r.catalog,denominator:r.denominator,total:r.total,categories:r.categories.length}));
  lines.push(`## ${r.title}`,'',r.scope,'',r.denominator.definition,'',`统计窗口：${r.window}`,'',`数量：${n(r.total.matchedPackages)} / ${n(r.total.packages)} = ${pct(r.total.packageCoverage)}；${weight}加权：${pct(r.total.downloadCoverage)}；有权重观测的包/包族：${r.total.knownDownloads}/${r.total.packages}。`,'',`| 标签 | 命中/全部库数 | 数量覆盖率 | 命中/已观测${weight}计数 | ${weight}加权 |`,'|---|---:|---:|---:|---:|');
  for(const c of r.categories)lines.push(`| ${c.label} | ${n(c.matchedPackages)} / ${n(c.packages)} | ${pct(c.packageCoverage)} | ${c.knownDownloads?n(c.matchedDownloads)+' / '+n(c.totalDownloads):'待补数据'} | ${pct(c.downloadCoverage)} |`);
  lines.push('','### 限制','',...r.limitations.map(x=>'- '+x),'');
 }
 await fs.writeFile(path.join(dir,'SUMMARY.md'),lines.join('\n')+'\n');
}
