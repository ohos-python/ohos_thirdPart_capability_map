// Offline unit tests: no browser, network, external services or user browser storage.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index-v1.html'),'utf8');
const source=fs.readFileSync(path.join(root,'scenarios-v1.js'),'utf8');
const dataSource=fs.readFileSync(path.join(root,'scenarios-v1-data.js'),'utf8');
const coverageSource=fs.readFileSync(path.join(root,'scenarios-v1-coverage.js'),'utf8');
const candidateSource=fs.readFileSync(path.join(root,'scenarios-v1-library-candidates.js'),'utf8');
const KEY='ohos-scenario-scope-v1';
class Element{
 constructor(){this.handlers={};this.value='';this.textContent='';this.innerHTML='';this.hidden=false;this.dataset={};this.classList={toggle(){}};}
 addEventListener(name,fn){this.handlers[name]=fn;}
 scrollIntoView(){}
 click(){this.handlers.click?.({target:this});}
}
function app(store=new Map(),options={}){
 const nodes=Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new Element()]));
 nodes['status-filter'].value='all';
 const badges=new Map();let confirmed=true,blob,download;
 const document={getElementById:id=>{assert.ok(nodes[id],'Missing element '+id);return nodes[id];},
  createElement:()=>{const a=new Element();a.click=()=>{download={href:a.href,filename:a.download};};return a;},
  querySelector:sel=>{if(!badges.has(sel))badges.set(sel,new Element());return badges.get(sel);},
  querySelectorAll:()=>[...nodes.groups.innerHTML.matchAll(/class="domain-group"/g)].map(()=>new Element())};
 const context=vm.createContext({window:{},document,Blob,URL:{createObjectURL:b=>{blob=b;return 'blob:offline-test';},revokeObjectURL(){}},
  setTimeout:fn=>fn(),confirm:()=>confirmed,matchMedia:()=>({matches:false}),
  localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(options.denyStorage)throw new Error('blocked');store.set(k,v);}}});
 vm.runInContext(dataSource,context,{timeout:1000});vm.runInContext(coverageSource,context,{timeout:1000});vm.runInContext(candidateSource,context,{timeout:1000});vm.runInContext(source,context,{timeout:3000});
 const fire=(id,name,target=nodes[id])=>nodes[id].handlers[name]({target});
 return {nodes,store,data:context.window.SCENARIO_V1,fire,
  search:q=>{nodes.search.value=q;return fire('search','input');},
  category:id=>fire('domain-nav','click',{closest:()=>({dataset:{category:String(id)}})}),
  status:(id,value)=>fire('groups','change',{dataset:{scope:id},value}),
  note:(id,value)=>fire('groups','input',{dataset:{notes:id},value}),
  filter:value=>{nodes['status-filter'].value=value;return fire('status-filter','change');},
  export:async()=>{fire('export','click');assert.ok(download.filename.endsWith('.json'));return JSON.parse(await blob.text());},
  import:async(obj,accept=true)=>{confirmed=accept;const text=JSON.stringify(obj);nodes['import-file'].files=[{size:text.length,text:async()=>text}];return fire('import-file','change');}
 };
}
test('catalogue: 15 classes, 8 base scenarios each, 15 extensions, no missing content',()=>{
 const a=app();assert.equal(a.data.domains.length,15);assert.equal(a.data.rows.length,120);assert.equal(a.data.extensions.length,15);
 assert.deepEqual(Array.from(a.data.ecosystemEvidence,e=>e.ecosystem),['Go','Java','Rust']);
 assert.ok(a.data.ecosystemEvidence.every(e=>e.status==='missing-data'&&e.label==='数据缺失'));
 for(let i=1;i<=15;i++)assert.equal(a.data.rows.filter(r=>r[0]===i).length,8);
 for(let row of a.data.rows)assert.ok(row.every(v=>v!==''&&v!=null));
 assert.equal(a.nodes['pending-count'].textContent,135);assert.equal(a.nodes['result-count'].textContent,'显示 135 / 135 个场景');
 assert.equal([...a.nodes.groups.innerHTML.matchAll(/<article /g)].length,135);
 assert.equal([...a.nodes.groups.innerHTML.matchAll(/class="coverage-tags"/g)].length,135);
 assert.equal([...a.nodes.groups.innerHTML.matchAll(/class="candidate-libraries"/g)].length,135);
 assert.match(a.nodes.groups.innerHTML,/本场景识别三方库 <span>29<\/span>/);
 assert.match(a.nodes.groups.innerHTML,/candidate-status-summary/);
 assert.match(a.nodes.groups.innerHTML,/已完成 6/);
 assert.match(a.nodes.groups.innerHTML,/进行中 15/);
 assert.match(a.nodes.groups.innerHTML,/主要来源语言 JS\/TS<\/span><span>识别库 29<\/span><span class="coverage-done">已完成 6<\/span><span class="coverage-progress">进行中 15/);
 assert.match(a.nodes.groups.innerHTML,/功能匹配 29/);
 assert.ok([...a.nodes.groups.innerHTML.matchAll(/class="evidence-missing"/g)].length>0);
 assert.match(a.nodes.groups.innerHTML,/参考生态数据缺失：/);
 assert.match(a.nodes.groups.innerHTML,/data-missing-ecosystems="[^"]*Go/);
 const ids=[...a.nodes.groups.innerHTML.matchAll(/<article[^>]+data-id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,135);
});
test('search, category, state filters and empty state',()=>{
 const a=app();a.category(12);assert.equal(a.nodes['result-count'].textContent,'显示 8 / 135 个场景');
 a.search('PPT');assert.equal(a.nodes['result-count'].textContent,'显示 2 / 135 个场景');
 a.search('unlikely-no-match-135');assert.equal(a.nodes.empty.hidden,false);
 a.fire('clear-filter','click');assert.equal(a.nodes['result-count'].textContent,'显示 135 / 135 个场景');
 a.category('extension');assert.equal(a.nodes['result-count'].textContent,'显示 15 / 135 个场景');
 a.search('机器人');assert.equal(a.nodes['result-count'].textContent,'显示 1 / 135 个场景');
});
test('decisions, notes, reload persistence and export round trip',async()=>{
 const a=app();a.status('S12-03','include');a.note('S12-03','先确认应用接口');assert.equal(a.nodes['pending-count'].textContent,134);
 a.filter('include');assert.equal(a.nodes['result-count'].textContent,'显示 1 / 135 个场景');
 const b=app(a.store);assert.equal(b.nodes['pending-count'].textContent,134);
 const payload=await b.export();assert.equal(payload.scenarios.length,135);assert.equal(Object.keys(payload.decisions).length,135);assert.equal(payload.decisions['S12-03'].notes,'先确认应用接口');
 assert.deepEqual(Array.from(payload.ecosystemEvidence,e=>e.ecosystem),['Go','Java','Rust']);
 assert.equal(payload.coverageEvidence.domains[13].involved,896);
 assert.equal(payload.libraryCandidates.domains[13].total,1296);
 assert.equal(Object.keys(payload.libraryCandidates.scenarios).length,135);
 assert.equal(Object.values(payload.libraryCandidates.domains).reduce((sum,item)=>sum+item.total,0),7648);
 assert.equal(payload.libraryCandidates.summary.uniqueLibraries,4755);
 assert.equal(payload.libraryCandidates.summary.functionMatchedRelations,4387);
 assert.equal(payload.libraryCandidates.summary.fallbackRelations,3261);
 assert.equal(payload.libraryCandidates.summary.functionMatchedRelations+payload.libraryCandidates.summary.fallbackRelations,7648);
 assert.ok(Object.values(payload.libraryCandidates.scenarios).every(item=>item.libraries.every(ref=>payload.libraryCandidates.libraries[ref.key]&&ref.projects>0&&ref.scenarioAssignmentBasis)));
 assert.ok(Object.values(payload.libraryCandidates.scenarios).flatMap(item=>item.libraries).some(ref=>ref.scenarioAssignment==='domain-fallback'));
 assert.equal(payload.libraryCandidates.registryMetadata.requested,2903);
 assert.equal(payload.libraryCandidates.registryMetadata.resolved,2686);
 assert.equal(payload.libraryCandidates.registryMetadata.failed,0);
 const libraries=Object.values(payload.libraryCandidates.libraries);
 assert.ok(libraries.some(item=>item.ecosystem==='JavaScript/TypeScript'&&item.functionBasis==='npm官方注册表元数据'&&/^https:\/\/www\.npmjs\.com\//.test(item.functionSourceUrl)));
 assert.ok(libraries.filter(item=>item.ecosystem==='JavaScript/TypeScript'||item.ecosystem==='C/C++').every(item=>item.status==='in-progress'));
 assert.ok(libraries.some(item=>item.name==='torch'&&item.status==='completed'));
 assert.ok(libraries.every(item=>typeof item.ecosystem==='string'&&item.ecosystem&&item.function&&item.functionBasis));
 const sceneNames=id=>payload.libraryCandidates.scenarios[id].libraries.map(ref=>payload.libraryCandidates.libraries[ref.key].name.toLowerCase());
 assert.ok(sceneNames('S07-01').includes('react'));
 assert.ok(sceneNames('S12-01').includes('playwright'));
 assert.ok(sceneNames('S02-02').includes('zlib'));
 assert.ok(sceneNames('S11-01').includes('openai'));
 assert.ok(payload.scenarios.every(s=>s.adaptationStatus==='未评估'));
 const c=app();await c.import(payload);assert.equal(c.nodes['pending-count'].textContent,134);
});
test('invalid imports are atomic, unknown IDs/prototype names are rejected, cancel preserves state',async()=>{
 const a=app();a.status('S12-01','include');
 const before=a.store.get(KEY);
 await a.import({schemaVersion:1,catalogueVersion:'1.0.0',decisions:{'S12-01':{status:'later',notes:''},'X-999':{status:'include',notes:''}}});assert.equal(a.store.get(KEY),before);
 await a.import({schemaVersion:1,catalogueVersion:'1.0.0',decisions:{'S12-01':{status:'__proto__',notes:''}}});assert.equal(a.store.get(KEY),before);
 const valid={schemaVersion:1,catalogueVersion:'1.0.0',decisions:{'S12-01':{status:'later',notes:''}}};await a.import(valid,false);assert.equal(a.store.get(KEY),before);
 await a.import({...valid,catalogueVersion:'2.0.0'});assert.equal(a.store.get(KEY),before);
});
test('imported notes are escaped when rendered; storage failures remain exportable',async()=>{
 const a=app(new Map(),{denyStorage:true});a.status('S01-01','later');assert.match(a.nodes['save-state'].textContent,/无法写入/);
 const p=await a.export();assert.equal(p.decisions['S01-01'].status,'later');
 await a.import({schemaVersion:1,catalogueVersion:'1.0.0',decisions:{'S01-01':{status:'include',notes:'</textarea><img src=x onerror=alert(1)>'}}});
 assert.ok(a.nodes.groups.innerHTML.includes('&lt;/textarea&gt;&lt;img'));assert.ok(!a.nodes.groups.innerHTML.includes('<img src=x'));
});
test('local assets and links exist; main index preserves baseline except approved Top50k navigation',()=>{
 for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(m[1].startsWith('#')||m[1].startsWith('http'))continue;
  assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);
 }
 // Keep the original baseline protection. Strip only the two expressly approved
 // navigation changes, then require every other byte (apart from CRLF) to match.
 const main=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/\r\n/g,'\n');
 const baseline=main
  .replace('    .hero-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }','    .hero-actions { display: flex; flex-wrap: wrap; margin-top: 20px; }')
  .replace('          <a class="scenario-link" href="python-top50k.html">Python Top5万覆盖分析 <span aria-hidden="true">→</span></a>\n','');
 assert.equal(crypto.createHash('sha256').update(baseline).digest('hex').toUpperCase(),'828B81C87F675A41200D2D44E2E87FE1CBE80CCEEFA9DBAE373C95185A1173FF');
 assert.ok(!/fetch\(|XMLHttpRequest|WebSocket\(/.test(source));
 assert.match(source,/class="candidate-language"/);
 assert.match(source,/输入库名、语言、功能、分配依据或状态/);
});

test('main page scenario analysis button links to V1, with a return link',()=>{
 const main=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const hero=main.match(/<header class="hero">([\s\S]*?)<\/header>/)?.[1];
 assert.ok(hero,'Main page hero exists');
 assert.match(hero,/<a class="scenario-link" href="index-v1\.html">场景分析\s*<span aria-hidden="true">→<\/span><\/a>/);
 assert.ok(fs.existsSync(path.join(root,'index-v1.html')));
 assert.match(html,/<a\b[^>]*href="index\.html"/);
});
