const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),base=path.join(root,'outputs/pypi-top100k-20260915');
const d=JSON.parse(fs.readFileSync(path.join(base,'rank-trends/summary.json'),'utf8'));
test('Python trend scope: 22 groups, 10 globally ranked cutoffs, totals conserved',()=>{
 assert.equal(d.groups.length,22);assert.equal(new Set(d.groups.map(g=>g.id)).size,22);
 for(const g of d.groups){assert.equal(g.points.length,10);g.points.forEach((p,i)=>{assert.equal(p.cutoff,(i+1)*10000);assert.equal(p.weightedCoverage,p.totalDownloads?p.matchedDownloads/p.totalDownloads:null);assert.equal(p.batch.weightedCoverage,p.batch.totalDownloads?p.batch.matchedDownloads/p.batch.totalDownloads:null);for(const k of ['packages','matchedPackages','totalDownloads','matchedDownloads'])assert.equal(p.batch[k],p[k]-(i?g.points[i-1][k]:0));assert.equal(p.changePp,i?(p.weightedCoverage-g.points[i-1].weightedCoverage)*100:null);});}
 for(let i=0;i<10;i++)for(const k of ['packages','matchedPackages','totalDownloads','matchedDownloads'])assert.equal(d.groups.slice(1).reduce((s,g)=>s+g.points[i][k],0),d.groups[0].points[i][k]);
});
test('Every scenario matches existing Top50k snapshot exactly',()=>{
 const old=JSON.parse(fs.readFileSync(path.join(base,'top50k-download-weighted/summary.json')));
 for(const g of d.groups){const expected=g.id==='overall'?old.total:old.categories.find(c=>c.id===g.id);for(const k of ['packages','matchedPackages','totalDownloads','matchedDownloads'])assert.equal(g.points[4][k],expected[k]);}
 assert.equal(d.groups[0].points[9].totalDownloads,139696506873);assert.equal(d.groups[0].points[9].matchedDownloads,105376504101);
});
test('Real local increases are retained, not forced into declining lines',()=>{
 assert.equal(d.groups.find(g=>g.id==='testing').points.filter(p=>p.changePp>0).length,1);
 assert.ok(d.groups[0].points.slice(1).every(p=>p.changePp<0));
});
test('22 SVGs have labelled axes and valid bounded marks',()=>{
 for(const g of d.groups){const svg=fs.readFileSync(path.join(base,'rank-trends',g.id+'.svg'),'utf8');assert.match(svg,/<title /);assert.match(svg,/局部纵轴/);assert.match(svg,/全局下载排名上限/);assert.match(svg,/0—100%/);assert.ok(!/NaN|undefined|Infinity/.test(svg));assert.equal((svg.match(/<circle /g)||[]).length,g.points.filter(p=>p.weightedCoverage!==null).length);for(const m of svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"/g)){assert(+m[1]>=105&&+m[1]<=1030);assert(+m[2]>=135&&+m[2]<=310);}}
});
test('Report contains all charts and links, without external runtime dependencies',()=>{
 const html=fs.readFileSync(path.join(root,'python-rank-trends.html'),'utf8');assert.equal((html.match(/<section id=/g)||[]).length,22);assert.equal((html.match(/<img /g)||[]).length,22);assert.ok(!/\bfetch\(|<script|https?:\/\//.test(html));
 for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g))assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);
 assert.match(fs.readFileSync(path.join(root,'python-top50k.html'),'utf8'),/href="#rank-trends"/);
});
test('Top50k page embeds all 22 charts with unique anchors, not an iframe',()=>{
 const page=fs.readFileSync(path.join(root,'python-top50k.html'),'utf8');
 assert.ok(!page.includes('<iframe'));assert.equal((page.match(/PYTHON_RANK_TRENDS_START/g)||[]).length,1);
 const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const g of d.groups){assert.ok(ids.includes('rank-'+g.id));assert.ok(page.includes(`href="#rank-${g.id}"`));assert.ok(page.includes(`rank-trends/${g.id}.svg`));}
 assert.equal((page.match(/<img loading="lazy"/g)||[]).length,22);
 for(const anchor of page.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(anchor[1]),anchor[1]);
 for(const file of page.matchAll(/(?:href|src)="([^"#]+)"/g))if(!/^https?:/.test(file[1]))assert.ok(fs.existsSync(path.join(root,file[1])),file[1]);
 assert.match(page,/id="category-rows"/);assert.match(page,/id="missing-rows"/);assert.match(page,/id="matched-rows"/);
});
test('trend labels match Top50k presentation and preserve stable category IDs',()=>{
 const expected={foundation:'通用编程工具库',domain:'行业应用与待复核库'};
 const html=fs.readFileSync(path.join(root,'python-rank-trends.html'),'utf8');
 for(const [id,label] of Object.entries(expected)){
  assert.equal(d.groups.find(g=>g.id===id).label,label);
  assert.ok(fs.readFileSync(path.join(base,'rank-trends',id+'.svg'),'utf8').includes(label));
  assert.ok(html.includes(label));
 }
});
test('both trend reports contain the two collapsed category explanations',()=>{
 for(const name of ['python-rank-trends.html','python-top50k.html']){
  const html=fs.readFileSync(path.join(root,name),'utf8');
  assert.equal((html.match(/<details class="category-help">/g)||[]).length,2);
  assert.ok(!/<details class="category-help" open/.test(html));
  assert.ok(html.includes('轻触展开或收起解释'));assert.ok(html.includes('不沿用首页'));
 }
});
