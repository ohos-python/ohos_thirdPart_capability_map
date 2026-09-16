/* Static, same-directory snapshot. No network requests or remote execution. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id),D=window.ECOSYSTEM_COVERAGE_DATA;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=n=>n===null?'—':Number(n).toLocaleString('zh-CN');
 const pct=n=>n===null?'—':(n*100).toFixed(2)+'%';
 const url=s=>/^https:\/\//i.test(s||'')?esc(s):'';
 function validate(d){
  if(!d||d.schemaVersion!==1||!['node','cpp'].includes(d.ecosystem)||!Array.isArray(d.rows)||!Array.isArray(d.categories))throw Error('数据文件缺失或格式不正确');
  const seen=new Set(),categories=new Set(d.categories.map(c=>c.id));
  for(const r of d.rows){if(!r.name||seen.has(r.name)||!categories.has(r.categoryId)||typeof r.matched!=='boolean'||!(r.downloads===null||(Number.isSafeInteger(r.downloads)&&r.downloads>=0)))throw Error('逐库数据重复或无效');seen.add(r.name);}
  for(const b of [d.total,...d.categories]){
   const rows=b===d.total?d.rows:d.rows.filter(r=>r.categoryId===b.id),known=rows.filter(r=>r.downloads!==null),matched=rows.filter(r=>r.matched);
   const sums={packages:rows.length,matchedPackages:matched.length,knownDownloads:known.length,missingDownloads:rows.length-known.length,totalDownloads:known.reduce((n,r)=>n+r.downloads,0),matchedDownloads:known.filter(r=>r.matched).reduce((n,r)=>n+r.downloads,0)};
   for(const [k,v] of Object.entries(sums))if(b[k]!==v)throw Error('汇总与明细不一致：'+k);
   if(b.packageCoverage!==(b.packages?b.matchedPackages/b.packages:null)||b.downloadCoverage!==(b.totalDownloads?b.matchedDownloads/b.totalDownloads:null))throw Error('覆盖率不一致');
  }
  if(d.conanDownloads){
   const c=d.conanDownloads,seenDownloads=new Set();
   for(const r of c.rows){if(seenDownloads.has(r.name)||!Number.isSafeInteger(r.downloads)||r.downloads<0)throw Error('Conan下载数据无效');seenDownloads.add(r.name);const row=d.rows.find(p=>p.name===r.name&&p.platforms?.includes('conan'));if(row&&(row.conanDownloads!==r.downloads||row.matched!==r.matched))throw Error('Conan下载明细不一致');}
   if(c.totalObserved!==c.rows.reduce((s,r)=>s+r.downloads,0)||c.knownPackages!==d.rows.filter(r=>r.conanDownloads!==null&&r.conanDownloads!==undefined).length||c.totalPackages!==d.rows.filter(r=>r.platforms?.includes('conan')).length||c.fullCoverage!==null)throw Error('Conan下载汇总无效');
  }
 }
 try{validate(D);}catch(e){$('load-error').hidden=false;$('load-error').textContent='无法加载：'+e.message;return;}
 const cats=new Map(D.categories.map(c=>[c.id,c])),native=D.weightKind==='homebrew-installs';let page=0;const size=30;
 $('dashboard').hidden=false;$('scope').textContent=D.scope;$('snapshot').textContent=`快照：${D.generatedAt} · ${D.window}`;
 $('boundary').textContent=D.denominator.definition+' 目录命中不是端到端验证，不能外推为整个开发领域覆盖率。';
 $('count-rate').textContent=pct(D.total.packageCoverage);$('count-numbers').textContent=`${num(D.total.matchedPackages)} / ${num(D.total.packages)} 个样本包命中`;
 $('weight-rate').textContent=D.total.downloadCoverage===null?'待补数据':pct(D.total.downloadCoverage);
 $('weight-title').textContent=D.total.downloadStatus==='partial'?'下载量加权覆盖率（已获取子集）':'下载量加权覆盖率';
 $('weight-numbers').textContent=D.total.knownDownloads?`${num(D.total.matchedDownloads)} / ${num(D.total.totalDownloads)} 次`:'没有与分母一致的下载量，不能计算比例。';
 $('weight-quality').textContent=`下载数据：${num(D.total.knownDownloads)} / ${num(D.total.packages)} 包；缺失 ${num(D.total.missingDownloads)} 包。`;
 if(native){
  $('weight-title').textContent='Homebrew 安装量加权覆盖（子集）';
  $('weight-quality').textContent=`${num(D.heat.includedFormulae)} 个入选formula中 ${num(D.heat.reportedFormulae)} 个有安装记录，${num(D.heat.missingFormulaCounts)} 个未上榜（不当作0）。Conan-only不参与此指标。`;
  $('platform-filter').value='all';
  const stats=[...D.platformSummaries,{...D.total,id:'union',label:'两平台去重并集'},...(D.vcpkgBaseline?[{...D.vcpkgBaseline,id:'vcpkg'}]:[])];
  $('platform-rows').innerHTML=stats.map(s=>`<tr><td>${esc(s.label)}</td><td>${num(s.matchedPackages)} / ${num(s.packages)}</td><td>${pct(s.packageCoverage)}</td><td>${s.id==='homebrew'?`${num(s.matchedDownloads)} / ${num(s.totalDownloads)} 次安装；${pct(s.downloadCoverage)}（子集）`:s.id==='union'?'仅旁列Homebrew代理指标':s.id==='conan'&&D.conanDownloads?`仅 ${num(D.conanDownloads.knownPackages)} 个库有下载计数；全量覆盖率待补`:'— 未获取该平台下载量'}</td></tr>`).join('');
  if(D.conanDownloads){
   const c=D.conanDownloads;$('conan-download-section').hidden=false;
   $('conan-download-summary').textContent=`已取得 ${num(c.knownPackages)} / ${num(c.totalPackages)} 个Conan库的下载计数，缺失 ${num(c.totalPackages-c.knownPackages)} 个。热门榜所列计数合计 ${num(c.totalObserved)} 次，仅为该榜单小计；全量下载加权覆盖率暂不可计算。`;
   $('conan-download-rows').innerHTML=c.rows.map(r=>`<tr><td>${num(r.rank)}</td><td><a href="https://conan.io/center/recipes/${encodeURIComponent(r.name)}">${esc(r.name)}</a></td><td>${num(r.downloads)}</td><td>${r.matched===null?'不在本次分母':r.matched?'目录已命中':'目录未命中，待核查'}</td></tr>`).join('');
   $('conan-download-source').innerHTML=`来源：<a href="${url(c.url)}">Conan 官方首页</a> · 采集：${esc(c.fetchedAt)} · 字段：${esc(c.field)}`;
  }
  $('source-audit').textContent=`原始输入：Conan ${num(D.denominator.conanRecipes)} 个包族、Homebrew ${num(D.denominator.homebrewAll)} 个formula；Homebrew入选 ${num(D.denominator.homebrewIncludedFormulae)} 个，另 ${num(D.denominator.homebrewExcluded)} 个未取得本次范围证据。合并消除 ${num(D.denominator.mergedRecords)} 条重复/版本记录，保留 ${D.ambiguities.length} 条身份歧义供复核。官方安装总数与可枚举明细相差 ${num(D.heat.sourceTotalDifference)} 次（原因未确认）；本页仅按已枚举的入选条目求和，不补平差额。`;
 }
 $('catalog-summary').textContent=`鸿蒙来源目录：${num(D.catalog.unique)} 个去重包名；仅与当前样本交集计入分子。${D.ecosystem==='node'?'Electron、Playwright单列用户确认支持；只在样本含有同名npm包时计入分子，不从Python绑定推断。兼容清单与发布清单证据不等价。':'严格同名匹配，别名和整库/分模块映射尚待复核。'}`;
 if(native)$('catalog-summary').textContent=`鸿蒙目录：${num(D.catalog.unique)} 个包名。按同名、Homebrew官方别名及@版本族匹配，不核验版本兼容，不推断整库所有子模块可用。`;
 $('category-policy').textContent=`沿用首页 ${D.categories.length} 个${D.ecosystem==='node'?'Node.js':'C/C++'}标签；每包唯一主标签，不是V1细分场景。`;
 $('detail-category').innerHTML='<option value="all">全部场景</option>'+D.categories.map(c=>`<option value="${esc(c.id)}">${esc(c.label)}</option>`).join('');$('detail-category').value='all';
 const rate=(p,kind)=>p===null?'—':`<div class="rate ${kind}-rate"><span>${pct(p)}</span><div class="track" aria-hidden="true"><div class="fill ${kind}-fill" style="width:${p*100}%"></div></div></div>`;
 function cells(c){return `<td>${esc(c.label||'全量样本合计')}</td><td>${num(c.matchedPackages)} / ${num(c.packages)}</td><td>${rate(c.packageCoverage,'count')}</td><td>${c.knownDownloads?num(c.matchedDownloads)+' / '+num(c.totalDownloads):'—'}</td><td>${rate(c.downloadCoverage,'download')}</td><td>${num(c.knownDownloads)} / ${num(c.packages)}${c.downloadStatus==='partial'?'（子集）':c.downloadStatus==='unavailable'?'（待补）':''}</td>`;}
 function renderCategories(){
  const query=$('category-search').value.trim().toLowerCase(),sort=$('sort').value;
  const rows=D.categories.filter(c=>c.label.toLowerCase().includes(query)).slice();
  if(sort!=='original')rows.sort((a,b)=>sort==='count'?(b.packageCoverage??-1)-(a.packageCoverage??-1):sort==='weight'?(b.downloadCoverage??-1)-(a.downloadCoverage??-1):(b.packages-b.matchedPackages)-(a.packages-a.matchedPackages));
  $('category-rows').innerHTML=rows.map(c=>`<tr>${cells(c)}<td><button type="button" class="detail-button" data-category="${esc(c.id)}">查看库</button></td></tr>`).join('');
  $('total-row').innerHTML=`<tr>${cells(D.total)}<td>不随筛选变化</td></tr>`;$('result-count').textContent=`${rows.length} / ${D.categories.length} 个标签`;$('no-results').hidden=!!rows.length;
 }
 function renderLibraries(){
  const category=$('detail-category').value,match=$('match-filter').value,q=$('package-search').value.trim().toLowerCase();
  const platform=native?$('platform-filter').value:'all';
  const rows=D.rows.filter(r=>(category==='all'||r.categoryId===category)&&(match==='all'||(match==='matched')===r.matched)&&(platform==='all'||(platform==='both'?r.platforms?.length===2:r.platforms?.includes(platform)))&&`${r.name} ${r.description} ${(r.homebrewFormulae||[]).map(f=>f.name).join(' ')}`.toLowerCase().includes(q)).sort((a,b)=>(b.downloads??-1)-(a.downloads??-1)||a.name.localeCompare(b.name));
  const pages=Math.max(1,Math.ceil(rows.length/size));page=Math.min(page,pages-1);
  $('detail-summary').textContent=`${category==='all'?'全部场景':cats.get(category).label} · 筛选后 ${num(rows.length)} 个包；以下为功能描述和目录证据，不是真机结果。`;
  $('library-rows').innerHTML=rows.slice(page*size,(page+1)*size).map(r=>`<tr><td>${url(r.sourceUrl)?`<a href="${url(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>`:esc(r.name)}<small>${esc(r.description||'暂无官方功能描述')}</small>${native?`<small>来源：${esc(r.platforms.join(' + '))}${r.homebrewFormulae.length?'<br>Homebrew：'+r.homebrewFormulae.map(f=>`<a href="${url(f.sourceUrl)}">${esc(f.name)}</a>`).join('、'):''}</small>`:''}</td><td>${esc(cats.get(r.categoryId).label)}<small>${esc(r.classification)}</small></td><td><span class="library-state ${r.matched?'matched':'missing'}">${r.matched?'已命中':'待核查'}</span><small>${esc(r.matchBasis)}${r.catalogName?'<br>目录名：'+esc(r.catalogName):''}</small></td><td>${num(r.downloads)}${native&&r.missingFormulaCounts?`<small>${r.missingFormulaCounts} 个formula未上榜</small>`:''}</td>${D.ecosystem==='cpp'?`<td>${r.conanDownloads==null?(r.platforms?.includes('conan')?'未取得':'不在Conan分母'):num(r.conanDownloads)}</td>`:''}</tr>`).join('')||`<tr><td colspan="${D.ecosystem==='cpp'?5:4}">没有匹配的库，请调整筛选条件。</td></tr>`;
  $('page-label').textContent=`第 ${page+1} / ${pages} 页`;$('previous').disabled=page===0;$('next').disabled=page>=pages-1;
 }
 $('category-search').addEventListener('input',renderCategories);$('sort').addEventListener('change',renderCategories);
 $('category-rows').addEventListener('click',e=>{const id=e.target.closest('[data-category]')?.dataset.category;if(!cats.has(id))return;$('detail-category').value=id;page=0;renderLibraries();$('details').scrollIntoView({block:'start'});});
 for(const [id,event] of [['detail-category','change'],['match-filter','change'],['package-search','input']])$(id).addEventListener(event,()=>{page=0;renderLibraries();});
 if(native)$('platform-filter').addEventListener('change',()=>{page=0;renderLibraries();});
 $('previous').addEventListener('click',()=>{page=Math.max(0,page-1);renderLibraries();});$('next').addEventListener('click',()=>{page++;renderLibraries();});
 $('denominator').textContent=`分母：${D.denominator.definition} 输入 ${num(D.denominator.inputCandidates)} 条候选，排除 ${num(D.denominator.excluded)} 条；不声称取得全生态Top5万榜单。`;
 $('limitations').innerHTML=D.limitations.map(s=>`<li>${esc(s)}</li>`).join('');
 $('sources').innerHTML=D.sources.map(s=>`<li>${s.url&&url(s.url)?`<a href="${url(s.url)}">${esc(s.label)}</a>`:esc(s.label||s.file)}${s.file?' · '+esc(s.file):''}${s.sha256?'<br><code>SHA-256: '+esc(s.sha256)+'</code>':''}</li>`).join('');
 $('excluded').textContent=`排除记录 ${D.excluded.length} 条，原因与包名包含在导出的JSON内。`;
 $('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(D,null,2)],{type:'application/json;charset=utf-8'}),href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download=D.ecosystem+'-coverage-snapshot.json';a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);});
 renderCategories();renderLibraries();
})();
