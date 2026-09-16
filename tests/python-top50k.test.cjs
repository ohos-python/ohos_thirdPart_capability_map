const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'python-top50k.html'),'utf8');
const script=fs.readFileSync(path.join(root,'python-top50k.js'),'utf8');
const payload=fs.readFileSync(path.join(root,'python-top50k-data.js'),'utf8');
function loadData(){const ctx={window:{}};vm.runInNewContext(payload,ctx);return JSON.parse(JSON.stringify(ctx.window.PYTHON_TOP50K_COVERAGE));}
function app(data=loadData()){
  class Element{
    constructor(){this.textContent='';this.innerHTML='';this.value='';this.hidden=false;this.style={};this.events={};}
    addEventListener(type,fn){this.events[type]=fn;}
    scrollIntoView(){this.scrolled=true;}
    click(){this.clicked=true;}
    remove(){this.removed=true;}
  }
  const nodes=Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new Element()]));
  nodes.dashboard.hidden=true;nodes['load-error'].hidden=true;nodes['sort-order'].value='original';
  let blob,anchor;
  const document={getElementById:id=>{assert.ok(nodes[id],id);return nodes[id];},createElement:()=>{anchor=new Element();return anchor;},body:{appendChild(){}}};
  vm.runInNewContext(script,{window:{PYTHON_TOP50K_COVERAGE:data},document,Blob,URL:{createObjectURL:b=>{blob=b;return 'blob:test';},revokeObjectURL(){}},setTimeout:fn=>fn()});
  return{nodes,data,fire:(id,type,event={})=>nodes[id].events[type](event),exported:async()=>JSON.parse(await blob.text()),anchor:()=>anchor};
}
test('snapshot: exact Top50k totals, 21 exclusive category sums and ratios',()=>{
  const d=loadData();assert.equal(d.categories.length,21);assert.equal(new Set(d.categories.map(c=>c.id)).size,21);
  assert.equal(d.total.packages,50000);assert.equal(d.total.matchedPackages,12082);
  assert.equal(d.total.totalDownloads,139567021774);assert.equal(d.total.matchedDownloads,105369147867);
  for(const key of ['packages','matchedPackages','totalDownloads','matchedDownloads'])assert.equal(d.categories.reduce((s,c)=>s+c[key],0),d.total[key]);
  for(const c of d.categories){assert.equal(c.downloadWeightedCoverage,c.matchedDownloads/c.totalDownloads);assert.equal(c.packageCoverage,c.matchedPackages/c.packages);}
});
test('first render: both metrics, all rows and unique IDs',()=>{
  const a=app();assert.equal(a.nodes.dashboard.hidden,false);
  assert.equal(a.nodes['count-coverage'].textContent,'24.16%');assert.equal(a.nodes['download-coverage'].textContent,'75.50%');
  assert.equal((a.nodes['category-rows'].innerHTML.match(/data-row=/g)||[]).length,21);
  assert.match(a.nodes.snapshot.textContent,/2026-09-14/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size);
});
test('filter and empty state do not change global denominators',()=>{
  const a=app();a.nodes['category-search'].value='Agent';a.fire('category-search','input');
  assert.equal((a.nodes['category-rows'].innerHTML.match(/data-row=/g)||[]).length,1);assert.match(a.nodes['category-rows'].innerHTML,/Agent与TUI/);
  a.nodes['category-search'].value='NO_SUCH_SCENE';a.fire('category-search','input');assert.equal(a.nodes['no-results'].hidden,false);
  assert.equal(a.nodes['count-coverage'].textContent,'24.16%');assert.match(a.nodes['table-total'].innerHTML,/50,000/);
  a.nodes['category-search'].value='';a.fire('category-search','input');assert.equal(a.nodes['no-results'].hidden,true);
});
test('all sort orders preserve 21 categories and sort by correct quantity',()=>{
  const a=app();
  for(const [sort,value] of [['downloads',c=>c.downloadWeightedCoverage],['count',c=>c.packageCoverage],['gap',c=>c.unmatchedDownloads]]){
    a.nodes['sort-order'].value=sort;a.fire('sort-order','change');
    const ids=[...a.nodes['category-rows'].innerHTML.matchAll(/data-row="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,21);const vals=ids.map(id=>value(a.data.categories.find(c=>c.id===id)));
    assert.ok(vals.every((v,i)=>i===0||v<=vals[i-1]));
  }
});
test('row drilldown and dropdown render matching category and precise numbers',()=>{
  const a=app();a.fire('category-rows','click',{target:{closest:()=>({dataset:{category:'cloud'}})}});
  assert.match(a.nodes['detail-title'].textContent,/云服务/);assert.match(a.nodes['missing-rows'].innerHTML,/boto3/);
  assert.match(a.nodes['detail-summary'].textContent,/10,309,994,071/);assert.ok(a.nodes.details.scrolled);
  a.nodes['detail-category'].value='office';a.fire('detail-category','change');assert.match(a.nodes['detail-title'].textContent,/通用办公/);
});
test('export retains integer data and provenance',async()=>{
  const a=app();a.fire('export-data','click');const d=await a.exported();assert.deepEqual(d,a.data);
  assert.ok(a.anchor().download.endsWith('.json'));assert.ok(a.anchor().clicked);
});
test('no records is not reported as zero coverage and labels are escaped',()=>{
  const d=loadData();const c=d.categories.find(c=>c.id==='cloud');c.label='<script>test</script>';c.topMissing=[];c.topMatched=[];
  const a=app(d);a.nodes['detail-category'].value='cloud';a.fire('detail-category','change');
  assert.ok(!a.nodes['category-rows'].innerHTML.includes('<script>'));assert.match(a.nodes['category-rows'].innerHTML,/&lt;script&gt;/);
  assert.match(a.nodes['missing-rows'].innerHTML,/无未命中/);assert.match(a.nodes['matched-rows'].innerHTML,/无命中/);
});
test('missing or inconsistent data gives readable error',()=>{
  for(const d of [null,{total:{},categories:[]}]){const a=app(d);assert.equal(a.nodes['load-error'].hidden,false);assert.equal(a.nodes.dashboard.hidden,true);}
  const d=loadData();d.total.totalDownloads++;const a=app(d);assert.equal(a.nodes['load-error'].hidden,false);
});
test('homepage entry and all static runtime assets exist without a backend',()=>{
  const index=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(index,/href="python-top50k.html"/);assert.match(index,/href="index-v1.html"/);
  assert.match(html,/href="index.html"/);assert.match(html,/aria-current="page"/);
  for(const m of html.matchAll(/(?:src|href)="(python-top50k[^"#]+)"/g))assert.ok(fs.existsSync(path.join(root,m[1])));
  assert.ok(!/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(script));
});
