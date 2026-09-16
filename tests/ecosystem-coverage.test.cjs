const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'ecosystem-coverage.js'),'utf8');
function data(kind){const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,kind+'-coverage-data.js'),'utf8'),c);return JSON.parse(JSON.stringify(c.window.ECOSYSTEM_COVERAGE_DATA));}
function app(kind='nodejs',d=data(kind)){
 const html=fs.readFileSync(path.join(root,kind+'-coverage.html'),'utf8');
 class Element{constructor(){this.value='';this.textContent='';this.innerHTML='';this.hidden=false;this.events={};}addEventListener(e,f){this.events[e]=f;}scrollIntoView(){this.scrolled=true;}click(){this.clicked=true;}}
 const nodes=Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new Element()]));nodes.dashboard.hidden=true;nodes['load-error'].hidden=true;nodes.sort.value='original';nodes['match-filter'].value='all';
 let blob;vm.runInNewContext(script,{window:{ECOSYSTEM_COVERAGE_DATA:d},document:{getElementById:id=>{assert.ok(nodes[id],id);return nodes[id];},createElement:()=>new Element()},Blob,URL:{createObjectURL:b=>{blob=b;return 'blob:test';},revokeObjectURL(){}},setTimeout:fn=>fn()});
 return {nodes,d,fire:(id,e,event={})=>nodes[id].events[e](event),exported:async()=>JSON.parse(await blob.text())};
}
for(const kind of ['nodejs','cpp']){
 test(kind+': consistent snapshot, unique rows and category totals',()=>{
  const d=data(kind),a=app(kind,d);assert.equal(a.nodes.dashboard.hidden,false);assert.equal(a.nodes['load-error'].hidden,true);
  assert.equal(new Set(d.rows.map(r=>r.name)).size,d.total.packages);assert.equal(d.rows.length,d.total.packages);
  for(const k of ['packages','matchedPackages','knownDownloads','missingDownloads','totalDownloads','matchedDownloads'])assert.equal(d.categories.reduce((n,c)=>n+c[k],0),d.total[k]);
  assert.equal(d.denominator.top50kAvailable,false);assert.equal(d.categories.length,kind==='nodejs'?18:21);
 });
 test(kind+': static assets and unique DOM IDs',()=>{
  const html=fs.readFileSync(path.join(root,kind+'-coverage.html'),'utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g))if(!m[1].startsWith('http'))assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);
  assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),new RegExp('href="'+kind+'-coverage.html"'));
  assert.ok(!/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(script));
 });
 test(kind+': filtering, sort, drilldown, pagination preserve totals',()=>{
  const a=app(kind),original=a.nodes['count-rate'].textContent;
  a.nodes['category-search'].value='不存在的分类';a.fire('category-search','input');assert.equal(a.nodes['no-results'].hidden,false);
  a.nodes['category-search'].value='';a.fire('category-search','input');
  for(const key of ['count','weight','gap']){a.nodes.sort.value=key;a.fire('sort','change');const ids=[...a.nodes['category-rows'].innerHTML.matchAll(/data-category="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,a.d.categories.length);const val=id=>{const c=a.d.categories.find(c=>c.id===id);return key==='count'?c.packageCoverage??-1:key==='weight'?c.downloadCoverage??-1:c.packages-c.matchedPackages;};assert.ok(ids.every((id,i)=>i===0||val(id)<=val(ids[i-1])));}
  a.fire('next','click');assert.match(a.nodes['page-label'].textContent,/第 2/);a.fire('previous','click');assert.match(a.nodes['page-label'].textContent,/第 1/);
  const id=a.d.categories.find(c=>c.packages).id;a.fire('category-rows','click',{target:{closest:()=>({dataset:{category:id}})}});assert.equal(a.nodes['detail-category'].value,id);assert.ok(a.nodes.details.scrolled);
  a.nodes['package-search'].value='zz-no-such-package';a.fire('package-search','input');assert.match(a.nodes['library-rows'].innerHTML,/没有匹配/);assert.equal(a.nodes['count-rate'].textContent,original);
 });
 test(kind+': export has rows and provenance',async()=>{const a=app(kind);a.fire('export','click');assert.deepEqual(await a.exported(),a.d);});
 test(kind+': rejects malformed or inconsistent data',()=>{for(const d of [null,{schemaVersion:1}])assert.equal(app(kind,d).nodes['load-error'].hidden,false);const d=data(kind);d.total.matchedDownloads++;assert.equal(app(kind,d).nodes['load-error'].hidden,false);});
}
test('historical C++ unavailable downloads never show zero-percent coverage',()=>{const old=JSON.parse(fs.readFileSync(path.join(root,'outputs/ecosystem-coverage-20260916/cpp-vcpkg-baseline.json')));const a=app('cpp',old);assert.equal(a.d.total.knownDownloads,0);assert.equal(a.d.total.downloadCoverage,null);assert.equal(a.nodes['weight-rate'].textContent,'待补数据');assert.ok(!a.nodes['category-rows'].innerHTML.includes('download-rate'));});
test('npm fixed dates, full published catalogue and user overrides',()=>{const d=data('nodejs');assert.equal(d.catalog.portRecords,665);assert.equal(d.catalog.compatibleUnique,45748);assert.match(d.window,/2026-08-16/);assert.match(d.window,/2026-09-14/);assert.deepEqual(d.catalog.overrides,['electron','playwright']);const electron=d.rows.find(r=>r.name==='electron');assert.ok(electron.matched);assert.match(electron.matchBasis,/用户确认/);for(const name of d.catalog.overrides){const r=d.rows.find(r=>r.name===name);if(r){assert.ok(r.matched);assert.match(r.matchBasis,/用户确认/);}}assert.ok(d.rows.every(r=>r.downloads===null||r.downloadSource.includes('2026-08-16:2026-09-14')));});
test('external descriptions and URLs cannot inject HTML or executable links',()=>{const d=data('nodejs');d.rows[0].description='<img src=x onerror=alert(1)>';d.rows[0].sourceUrl='javascript:alert(1)';const a=app('nodejs',d);a.nodes['package-search'].value=d.rows[0].name;a.fire('package-search','input');assert.match(a.nodes['library-rows'].innerHTML,/&lt;img/);assert.ok(!a.nodes['library-rows'].innerHTML.includes('href="javascript:'));});
test('zero downloads differ from unknown; partial weighted coverage is labelled',async()=>{
 const {summarize}=await import('../outputs/ecosystem-coverage-20260916/build.mjs');
 const rows=[{name:'a',categoryId:'x',matched:true,downloads:10},{name:'b',categoryId:'x',matched:false,downloads:0},{name:'c',categoryId:'x',matched:false,downloads:null}];
 const s=summarize(rows,[['x','测试']]);assert.equal(s.total.knownDownloads,2);assert.equal(s.total.missingDownloads,1);assert.equal(s.total.downloadCoverage,1);assert.equal(s.total.downloadStatus,'partial');
 const d=data('nodejs');d.rows=rows;Object.assign(d,s);const a=app('nodejs',d);assert.match(a.nodes['weight-title'].textContent,/已获取子集/);
});
test('functional overrides beat incidental keywords without inventing C++ aliases',async()=>{
 const {classify}=await import('../outputs/ecosystem-coverage-20260916/classify.mjs');
 assert.equal(classify('node',{name:'electron',description:'HTML and CSS desktop apps'}).id,'system');
 assert.equal(classify('node',{name:'p-limit',keywords:['queue']}).id,'foundation');
 assert.equal(classify('node',{name:'source-map',description:'Generates and consumes source maps'}).id,'build');
 assert.equal(classify('cpp',{name:'abumq-ripe',description:'Lightweight cryptography library wrapper'}).id,'security');
 const cpp=JSON.parse(fs.readFileSync(path.join(root,'outputs/ecosystem-coverage-20260916/cpp-vcpkg-baseline.json')));const source=JSON.parse(fs.readFileSync(path.join(root,'outputs/ecosystem-coverage-20260916/vcpkg-registry.json')));assert.equal(cpp.total.packages+cpp.excluded.length,source.packages.length);
 assert.ok(cpp.rows.every(r=>!r.matched||r.name.toLowerCase()===r.catalogName.toLowerCase()));
});
test('native union conserves platform records and never imports Conan downloads',()=>{
 const d=data('cpp');assert.equal(d.denominator.kind,'conan-homebrew-union');assert.equal(d.denominator.conanRecipes,1948);
 assert.equal(d.denominator.inputCandidates-d.excluded.length-d.denominator.mergedRecords,d.rows.length);
 assert.equal(d.rows.filter(r=>r.platforms.includes('conan')).length,1948);
 assert.equal(d.rows.reduce((s,r)=>s+r.homebrewFormulae.length,0),d.denominator.homebrewIncludedFormulae);
 const formulas=d.rows.flatMap(r=>r.homebrewFormulae);assert.equal(new Set(formulas.map(f=>f.name)).size,formulas.length);
 assert.equal(formulas.filter(f=>f.installs!==null).reduce((s,f)=>s+f.installs,0),d.total.totalDownloads);
 assert.ok(d.rows.filter(r=>!r.platforms.includes('homebrew')).every(r=>r.downloads===null));
 assert.equal(d.platformSummaries.find(p=>p.id==='conan').downloadCoverage,null);
 assert.equal(d.total.totalDownloads,8524356);assert.equal(d.total.matchedDownloads,7005626);
});
test('native homebrew proxy has separate UI labels and works with platform filters',()=>{
 const a=app('cpp');assert.match(a.nodes['weight-title'].textContent,/Homebrew.*子集/);assert.match(a.nodes['weight-quality'].textContent,/Conan-only/);
 assert.match(a.nodes['platform-rows'].innerHTML,/vcpkg 历史同名对照/);assert.match(a.nodes['source-audit'].textContent,/相差 9 次/);
 a.nodes['platform-filter'].value='both';a.fire('platform-filter','change');assert.ok(!a.nodes['library-rows'].innerHTML.includes('来源：conan</small>'));
 a.nodes['package-search'].value='qtbase';a.fire('package-search','input');assert.match(a.nodes['library-rows'].innerHTML,/没有匹配/);
 a.nodes['platform-filter'].value='homebrew';a.fire('platform-filter','change');assert.match(a.nodes['library-rows'].innerHTML,/qtbase/);
});
test('shared homepages do not cause component support or count leakage',()=>{
 const d=data('cpp');const qt=d.rows.find(r=>r.name==='qt');assert.ok(qt);assert.ok(qt.homebrewFormulae.every(f=>/^qt(?:@\d.*)?$/.test(f.name)));
 const python=d.rows.find(r=>r.name==='cpython');assert.ok(python.homebrewFormulae.every(f=>/^python(?:@\d.*)?$/.test(f.name)));
 assert.ok(d.rows.some(r=>r.name==='qtbase'));assert.ok(d.rows.some(r=>r.name==='python-tk'));
});
test('Homebrew scope uses independent evidence, not presence in the OHOS catalogue',async()=>{
 const {brewEvidence,family,homepage}=await import('../outputs/ecosystem-coverage-20260916/build-native.mjs');
 assert.equal(brewEvidence({name:'made-up',description:'A Python CLI tool',build_dependencies:['python@3.14']},false),null);
 assert.ok(brewEvidence({description:'A C++ library'},false));assert.ok(brewEvidence({description:'A library',build_dependencies:['cmake']},false));
 assert.equal(brewEvidence({description:'A library',build_dependencies:['cmake','go']},false),null);
 assert.equal(family('openssl@3.5'),'openssl');assert.equal(family('qtbase'),'qtbase');
 assert.equal(homepage('https://github.com/Microsoft/CppRestSDK/'),homepage('https://github.com/microsoft/cpprestsdk'));
});
test('missing formula installs remain unknown, and upstream discrepancy is recorded',()=>{
 const d=data('cpp');assert.equal(d.heat.sourceTotalDifference,d.heat.allCoreInstalls-d.heat.observedCoreInstalls);
 const missing=d.rows.flatMap(r=>r.homebrewFormulae).filter(f=>f.installs===null);assert.equal(missing.length,d.heat.missingFormulaCounts);
 assert.ok(missing.length>0);assert.ok(d.rows.filter(r=>r.homebrewFormulae.length&&r.homebrewFormulae.every(f=>f.installs===null)).every(r=>r.downloads===null));
});
test('Conan official partial download counts are separate from Homebrew installations',()=>{
 const d=data('cpp'),c=d.conanDownloads,a=app('cpp',d);
 assert.equal(c.knownPackages,10);assert.equal(c.totalPackages,1948);assert.equal(c.window,null);assert.equal(c.fullCoverage,null);
 assert.equal(c.totalObserved,c.rows.reduce((s,r)=>s+r.downloads,0));
 assert.equal(c.rows.find(r=>r.name==='zlib').downloads,640352);
 assert.equal(a.nodes['conan-download-section'].hidden,false);
 assert.match(a.nodes['conan-download-summary'].textContent,/10 \/ 1,948/);
 assert.match(a.nodes['conan-download-summary'].textContent,/1,938/);
 assert.match(a.nodes['conan-download-rows'].innerHTML,/640,352/);
 assert.ok(!a.nodes['platform-rows'].innerHTML.includes('未获取该平台下载量</td></tr><tr><td>Homebrew'));
 a.nodes['package-search'].value='zlib';a.fire('package-search','input');assert.match(a.nodes['library-rows'].innerHTML,/640,352/);
 const missing=d.rows.find(r=>r.platforms.includes('conan')&&r.conanDownloads===null);
 a.nodes['package-search'].value=missing.name;a.fire('package-search','input');assert.match(a.nodes['library-rows'].innerHTML,/未取得/);
 assert.equal(d.total.totalDownloads,8524356);assert.equal(d.total.matchedDownloads,7005626);
});
test('Conan inconsistent download summaries fail validation',()=>{
 const d=data('cpp');d.conanDownloads.totalObserved++;assert.equal(app('cpp',d).nodes['load-error'].hidden,false);
 const e=data('cpp');e.rows.find(r=>r.name==='zlib').conanDownloads=0;assert.equal(app('cpp',e).nodes['load-error'].hidden,false);
});
