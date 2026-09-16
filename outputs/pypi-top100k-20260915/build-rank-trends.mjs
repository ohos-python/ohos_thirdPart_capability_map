import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../..');
const output=path.join(dir,'rank-trends');
const rankingBytes=await fs.readFile(path.join(dir,'ranking.json'));
const ranking=JSON.parse(rankingBytes);
const catBytes=await fs.readFile(path.join(root,'python-library-capabilities.js'));
const raw=catBytes.toString('utf8');
const catalog=JSON.parse(raw.slice(raw.indexOf('=')+1).trim().replace(/;$/,''));
const reference=JSON.parse(await fs.readFile(path.join(dir,'top50k-download-weighted/summary.json'),'utf8'));
const labelContext={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'category-display-labels.js'),'utf8'),labelContext);
const displayLabel=labelContext.window.CAPABILITY_CATEGORY_LABELS.label;
vm.runInNewContext(await fs.readFile(path.join(root,'python-category-help.js'),'utf8'),labelContext);
const categoryHelp=labelContext.window.PYTHON_CATEGORY_HELP;
const norm=n=>n.toLowerCase().replace(/[-_.]+/g,'-');
const supported=new Set(catalog.libraries.map(r=>norm(r.n)));
const classified=new Map(),classificationHash=createHash('sha256');
const input=createReadStream(path.join(dir,'packages-classified.jsonl'));input.on('data',b=>classificationHash.update(b));
for await(const line of readline.createInterface({input,crlfDelay:Infinity})){
 if(!line.trim())continue;const r=JSON.parse(line);assert(!classified.has(r.name));classified.set(r.name,{categoryId:r.categoryId,rank:r.rank,downloads:r.downloads});
}
const blank=()=>({packages:0,matchedPackages:0,totalDownloads:0,matchedDownloads:0});
const groups=[{id:'overall',label:'Python 总体'},...reference.categories.map(c=>({id:c.id,label:displayLabel(c.label)}))].map(c=>({...c,points:[],current:blank(),previous:blank()}));
const byId=new Map(groups.map(c=>[c.id,c]));
const rows=ranking.packages.slice().sort((a,b)=>a.rank-b.rank),seen=new Set();assert.equal(rows.length,100000);assert.equal(classified.size,100000);
for(let i=0;i<rows.length;i++){
 const r=rows[i],c=classified.get(r.name);assert.equal(r.rank,i+1);assert(c);assert.equal(c.rank,r.rank);assert.equal(c.downloads,r.downloads);assert(Number.isSafeInteger(r.downloads)&&r.downloads>=0);if(i)assert(rows[i-1].downloads>=r.downloads);
 assert(!seen.has(norm(r.name)));seen.add(norm(r.name));assert(byId.has(c.categoryId));
 for(const g of [groups[0],byId.get(c.categoryId)]){g.current.packages++;g.current.totalDownloads+=r.downloads;if(supported.has(norm(r.name))){g.current.matchedPackages++;g.current.matchedDownloads+=r.downloads;}}
 if(r.rank%10000===0){
  for(const g of groups){const b=g.current,p=g.previous,weight=b.totalDownloads?b.matchedDownloads/b.totalDownloads:null,prev=g.points.at(-1),batch=Object.fromEntries(Object.keys(b).map(k=>[k,b[k]-p[k]]));
   g.points.push({cutoff:r.rank,...b,weightedCoverage:weight,changePp:prev&&weight!==null&&prev.weightedCoverage!==null?(weight-prev.weightedCoverage)*100:null,batch:{...batch,weightedCoverage:batch.totalDownloads?batch.matchedDownloads/batch.totalDownloads:null}});g.previous={...b};
  }
 }
}
for(let i=0;i<10;i++)for(const key of Object.keys(blank()))assert.equal(groups.slice(1).reduce((s,g)=>s+g.points[i][key],0),groups[0].points[i][key]);
for(const g of groups){const expected=g.id==='overall'?reference.total:reference.categories.find(c=>c.id===g.id);for(const key of Object.keys(blank()))assert.equal(g.points[4][key],expected[key]);delete g.current;delete g.previous;}
const sha=b=>createHash('sha256').update(b).digest('hex');
const result={meta:{generatedAt:new Date().toISOString(),window:ranking.meta.window,source:ranking.meta.source,rankingSha256:sha(rankingBytes),catalogSha256:sha(catBytes),classificationSha256:classificationHash.digest('hex'),catalogNames:supported.size,cutoffPolicy:'全局Python下载排名Top1万至Top10万，每档增加1万个分发包；场景只取该全局范围内属于自己的库，不是场景内TopN。',metric:'目录命中库下载量 / 同一排名范围、同一场景全部库下载量',changePolicy:'当前累计覆盖率减上一档，单位为百分点；负值下降，正值上升。零分母保留null。',limitations:reference.meta.limitations.filter(s=>!s.includes('仅覆盖Top50000')).concat('本次分母扩大到Top100000，未重新采集；不是整个PyPI。图中的横轴是排名阈值，不是时间，也不是新增适配数量。')},groups};
await fs.mkdir(output,{recursive:true});await fs.writeFile(path.join(output,'summary.json'),JSON.stringify(result,null,2)+'\n');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=n=>n===null?'无样本':(n*100).toFixed(4)+'%';
const num=n=>n.toLocaleString('zh-CN');
const delta=n=>n===null?'—':(n>0?'+':'')+n.toFixed(4);
const blue='#2263a5',orange='#a64b14';
function chart(g){
 const W=1100,H=710,L=105,R=1030,x=i=>L+20+i*(R-L-40)/9;
 const values=g.points.map(p=>p.weightedCoverage===null?null:p.weightedCoverage*100).filter(v=>v!==null);
 const min=values.length?Math.min(...values):0,max=values.length?Math.max(...values):100,pad=Math.max((max-min)*0.28,0.015);
 const lo=Math.max(0,min-pad),hi=Math.min(100,max+pad);const y=v=>310-(v-lo)/(hi-lo||1)*175;
 let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc"><title id="title">${esc(g.label)}：Python下载量加权覆盖趋势</title><desc id="desc">全局Top1万逐档扩到Top10万。上图累计覆盖率使用局部纵轴；下图为新增排名区间内本场景覆盖率，纵轴0至100%。缺样本不填零。</desc><rect width="1100" height="710" fill="white"/><g font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" fill="#182536"><text x="45" y="42" font-size="25" font-weight="700">${esc(g.label)}</text><text x="45" y="72" font-size="15" fill="#53647a">2026-08-16—09-14 · 全局下载排名分档 · 目录命中口径 · 非时间趋势</text><text x="${L}" y="109" font-size="17" fill="${blue}">累计下载量加权覆盖率（局部纵轴，跨场景不可比较斜率）</text>`;
 for(let j=0;j<=4;j++){const v=lo+(hi-lo)*j/4,yy=y(v);s+=`<path d="M${L},${yy}H${R}" stroke="#e0e7ef"/><text x="${L-10}" y="${yy+5}" text-anchor="end" font-size="14">${v.toFixed(3)}%</text>`;}
 let current=[];const segments=[];
 for(let i=0;i<10;i++){const v=g.points[i].weightedCoverage;if(v===null){if(current.length)segments.push(current);current=[];}else current.push(`${x(i)},${y(v*100)}`);}if(current.length)segments.push(current);
 for(const seg of segments)s+=`<polyline points="${seg.join(' ')}" fill="none" stroke="${blue}" stroke-width="2.5"/>`;
 g.points.forEach((p,i)=>{if(p.weightedCoverage===null)return;const yy=y(p.weightedCoverage*100);s+=`<circle cx="${x(i)}" cy="${yy}" r="4.5" fill="${blue}"/><text x="${x(i)}" y="${yy-13}" text-anchor="middle" font-size="13">${pct(p.weightedCoverage)}</text>`;});
 s+=`<text x="${L}" y="388" font-size="17" fill="${orange}">新增排名区间中，本场景库的下载量加权覆盖率（0—100%）</text>`;
 const y2=v=>580-v*1.45;
 for(const v of [0,50,100])s+=`<path d="M${L},${y2(v)}H${R}" stroke="#e0e7ef"/><text x="${L-10}" y="${y2(v)+5}" text-anchor="end" font-size="14">${v}%</text>`;
 g.points.forEach((p,i)=>{const v=p.batch.weightedCoverage,xx=x(i);if(v!==null){const yy=y2(v*100);s+=`<rect x="${xx-23}" y="${yy}" width="46" height="${580-yy}" fill="${orange}"/><text x="${xx}" y="${yy-9}" text-anchor="middle" font-size="13">${(v*100).toFixed(2)}%</text>`;}else s+=`<text x="${xx}" y="560" text-anchor="middle" font-size="13">无样本</text>`;s+=`<text x="${xx}" y="608" text-anchor="middle" font-size="14">${i+1}万</text><text x="${xx}" y="339" text-anchor="middle" font-size="14">${i+1}万</text>`;});
 s+=`<text x="565" y="640" text-anchor="middle" font-size="15">全局下载排名上限（包数）；下图第 N 档 = 排名 (N−1)万+1 至 N万</text><text x="45" y="684" font-size="14" fill="#53647a">ClickPy镜像快照；未经BigQuery独立复核。下载权重不代表端到端能力，空分母不视作0%。</text></g></svg>`;return s;
}
const sections=[];
for(const g of groups){
 assert(/^[a-z0-9-]+$/.test(g.id));const svg=chart(g);await fs.writeFile(path.join(output,g.id+'.svg'),svg);
 const first=g.points[0],last=g.points.at(-1),net=first.weightedCoverage===null||last.weightedCoverage===null?null:(last.weightedCoverage-first.weightedCoverage)*100;
 const ds=g.points.slice(1).map(p=>p.changePp).filter(v=>v!==null),ups=ds.filter(v=>v>1e-10).length,downs=ds.filter(v=>v< -1e-10).length;
 const trend=ups&&downs?'有升有降':ups?'上升或持平':downs?'下降或持平':'持平或样本不足';
 const prefix='outputs/pypi-top100k-20260915/rank-trends/';
 sections.push(`<section id="${g.id}"><h2>${esc(g.label)}</h2><p>累计 ${pct(first.weightedCoverage)} → ${pct(last.weightedCoverage)}；净变化 ${delta(net)} 个百分点；${trend}。Top10万内：${num(last.matchedPackages)} / ${num(last.packages)} 个库命中。</p><div class="chart"><img src="${prefix+g.id}.svg" width="1100" height="710" alt="${esc(g.label)}的累计与新增区间下载加权覆盖趋势"></div><p><a href="${prefix+g.id}.svg" download>下载矢量图 SVG</a></p><details><summary>查看10档精确数值（变化单位：百分点）</summary><div class="table"><table><thead><tr><th>全局排名范围</th><th>场景命中/全部库</th><th>命中/全部下载计数</th><th>累计覆盖率</th><th>比上一档变化</th><th>新增区间本场景覆盖率</th></tr></thead><tbody>${g.points.map(p=>`<tr><td>Top${p.cutoff/10000}万</td><td>${num(p.matchedPackages)} / ${num(p.packages)}</td><td>${num(p.matchedDownloads)} / ${num(p.totalDownloads)}</td><td>${pct(p.weightedCoverage)}</td><td>${delta(p.changePp)}</td><td>${pct(p.batch.weightedCoverage)}</td></tr>`).join('')}</tbody></table></div></details></section>`);
}
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Python 下载排名覆盖趋势</title><style>body{margin:0;background:#f6f8fc;color:#182536;font:16px/1.75 "Microsoft YaHei",sans-serif}main{max-width:1180px;margin:auto;padding:28px 20px}a{color:#2263a5}nav{display:flex;gap:18px;flex-wrap:wrap}h1{font-size:32px}h2{font-size:23px;margin-top:0}.note{border-left:4px solid #2263a5;padding:14px 18px;background:#eaf1f9}section{background:white;padding:24px;margin:26px 0;border:1px solid #dde5ef;border-radius:12px}.chart,.table{overflow-x:auto}.chart img{display:block;width:100%;min-width:920px;height:auto}table{border-collapse:collapse;min-width:900px;width:100%;font-size:14px}td,th{border-bottom:1px solid #dce3ed;padding:10px;text-align:right}td:first-child,th:first-child{text-align:left}summary{cursor:pointer;font-weight:600}.jump{display:flex;gap:8px 20px;flex-wrap:wrap;margin:24px 0}footer{color:#53647a;font-size:14px}@media(max-width:600px){main{padding:18px 12px}section{padding:14px}h1{font-size:26px}}@media print{body{background:white}section{break-inside:avoid;border:0;padding:0}.chart img{min-width:0}nav,.jump,details{display:none}}</style></head><body><main><nav><a href="index.html">← 能力地图</a><a href="python-top50k.html">Python Top5万</a><a href="outputs/pypi-top100k-20260915/rank-trends/summary.json" download>下载趋势数据 JSON</a></nav><h1>Python · 下载排名覆盖趋势</h1><p>总体1张 + 21个场景各1张。Top1万 → Top10万，每档扩大1万个分发包；当前已适配清单固定不变。</p><div class="note">上图：当前排名范围内，命中库下载量 ÷ 全部库下载量。下图：仅新增排名区间内的同一比例。<br>场景图从<strong>全局TopN</strong>筛选本场景的库，并不是每个场景分别取N万个库。蓝线纵轴局部放大，必须结合刻度判断幅度，不可跨图比较斜率；下方柱图统一0—100%。<br>这是排名分母扩大时的敏感性分析，不是时间走势，不表示预测或新增适配收益。手机可横向查看图表。</div><div class="jump">${groups.map(g=>`<a href="#${g.id}">${esc(g.label)}</a>`).join('')}</div>${sections.join('\n')}<footer><h2>统计边界</h2><ul>${result.meta.limitations.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p>生成时间：${esc(result.meta.generatedAt)}。所有数据和图表均为本地静态文件，不请求外部网络。</p></footer></main></body></html>`;
// Add native, initially collapsed explanations next to the actual chart labels.
for(let i=0;i<groups.length;i++)if(categoryHelp.has(groups[i].id)){
 const heading=`<h2>${esc(groups[i].label)}</h2>`;
 sections[i]=sections[i].replace(heading,heading+categoryHelp.html(groups[i].id,groups[i].label));
}
let standalone=html.replace('</head>','<link rel="stylesheet" href="python-rank-trends.css"></head>');
for(const g of groups)if(categoryHelp.has(g.id)){
 const heading=`<h2>${esc(g.label)}</h2>`;
 standalone=standalone.replace(heading,heading+categoryHelp.html(g.id,g.label));
}
await fs.writeFile(path.join(root,'python-rank-trends.html'),standalone);
// Merge the same plots into the existing Python Top50k page, without an iframe.
// Managed markers make rebuilding idempotent and preserve all existing content.
const mergedSections=sections.map(s=>s.replace(/<section id="([^"]+)"/, '<section id="rank-$1"').replace('<img src=', '<img loading="lazy" src='));
const merged=`<section class="rank-trends" id="rank-trends" aria-labelledby="rank-trends-title">
 <div class="section-heading"><div><div class="eyebrow">PYTHON RANK TRENDS</div><h2 id="rank-trends-title">Top1万—10万 · 总体与21个场景趋势</h2><p>与上方Top5万使用同一快照、同一适配目录和同一场景标签；所有图中的5万节点对应上方统计。</p></div><a href="outputs/pypi-top100k-20260915/rank-trends/summary.json" download>下载趋势 JSON</a></div>
 <aside class="notice">横轴是全局下载排名范围，不是时间或新增适配数量。场景只取全局TopN内属于本场景的库。上图为累计下载加权覆盖率，纵轴局部放大，不能跨图比较斜率；下图为新增排名区间的覆盖率，统一0—100%。统计窗口2026-08-16—09-14，原有数据限制继续适用。</aside>
 <nav class="jump" aria-label="Python趋势场景导航">${groups.map(g=>`<a href="#rank-${g.id}">${esc(g.label)}</a>`).join('')}</nav>
 ${mergedSections.join('\n')}
 <div class="trend-boundary"><h3>趋势口径与限制</h3><ul>${result.meta.limitations.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><a href="#comparison">↑ 返回Top5万场景覆盖</a></div>
</section>`;
const pagePath=path.join(root,'python-top50k.html'),page=await fs.readFile(pagePath,'utf8');
const marker=/<!-- PYTHON_RANK_TRENDS_START -->[\s\S]*?<!-- PYTHON_RANK_TRENDS_END -->/;
assert(marker.test(page),'Top50k page merge markers missing');
await fs.writeFile(pagePath,page.replace(marker,`<!-- PYTHON_RANK_TRENDS_START -->\n${merged}\n<!-- PYTHON_RANK_TRENDS_END -->`));
console.log(JSON.stringify({charts:groups.length,points:groups.length*10,output,page:'python-rank-trends.html',trends:groups.map(g=>({id:g.id,label:g.label,start:g.points[0].weightedCoverage,end:g.points.at(-1).weightedCoverage,upSteps:g.points.filter(p=>p.changePp>0).length}))},null,2));
