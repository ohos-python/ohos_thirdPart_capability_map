(function(){
  'use strict';
  const data=window.PYTHON_TOP50K_COVERAGE;
  const $=id=>document.getElementById(id);
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=n=>n.toLocaleString('en-US');
  const percent=n=>n===null?'N/A':(n*100).toFixed(2)+'%';
  const yi=n=>(n/1e8).toFixed(2);
  const ratio=(n,d)=>d?n/d:null;
  const categoryLabel=c=>window.PYTHON_CATEGORY_HELP.html(c.id,c.label);
  function valid(){
    if(!data||!data.total||!Array.isArray(data.categories)||!data.categories.length)return false;
    if(new Set(data.categories.map(c=>c.id)).size!==data.categories.length)return false;
    for(const c of [...data.categories,data.total]){
      for(const k of ['packages','matchedPackages','totalDownloads','matchedDownloads'])if(!Number.isSafeInteger(c[k])||c[k]<0)return false;
      if(c.matchedPackages>c.packages||c.matchedDownloads>c.totalDownloads)return false;
    }
    return ['packages','matchedPackages','totalDownloads','matchedDownloads'].every(k=>data.categories.reduce((sum,c)=>sum+c[k],0)===data.total[k]);
  }
  if(!valid()){
    $('load-error').hidden=false;$('load-error').textContent='统计数据未加载或汇总校验失败。请确认 python-top50k-data.js 与页面同目录，刷新后重试。';$('snapshot').textContent='数据暂不可用';return;
  }
  const total=data.total;
  const countRate=ratio(total.matchedPackages,total.packages),downloadRate=ratio(total.matchedDownloads,total.totalDownloads);
  $('dashboard').hidden=false;
  const endInclusive=new Date(Date.parse(data.meta.window.endExclusive+'T00:00:00Z')-86400000).toISOString().slice(0,10);
  $('snapshot').textContent=`统计窗口 ${data.meta.window.start} 至 ${endInclusive}（UTC，${data.meta.window.days}天） · 排名快照 ${data.meta.rankingSnapshotAt.slice(0,10)} · ${data.categories.length}个主标签`;
  $('count-coverage').textContent=percent(countRate);
  $('download-coverage').textContent=percent(downloadRate);
  $('count-total').textContent=`已完成目录命中 ${number(total.matchedPackages)} / ${number(total.packages)} 个包`;
  $('download-total').textContent=`命中包下载 ${yi(total.matchedDownloads)} / ${yi(total.totalDownloads)} 亿次`;
  $('count-bar').style.width=percent(countRate);$('download-bar').style.width=percent(downloadRate);
  $('interpretation').textContent=`数量覆盖率衡量库的覆盖广度，下载量加权覆盖率作为按使用热度衡量场景支持度的代理指标。两者相差 ${((downloadRate-countRate)*100).toFixed(2)} 个百分点，说明当前命中库贡献了相对更多的样本下载量。`;
  const unknown=data.categories.find(c=>c.id==='other');
  $('unclassified').textContent=unknown?`其他/待确认：${number(unknown.packages)} 个包，占总下载量 ${percent(unknown.totalDownloads/total.totalDownloads)}；分类修订会影响场景间的分配。`:'';
  $('detail-category').innerHTML=data.categories.map(c=>`<option value="${escape(c.id)}">${escape(c.label)}</option>`).join('');
  $('detail-category').value=data.categories[0].id;
  $('limitations').innerHTML=data.meta.limitations.map(s=>`<li>${escape(s)}</li>`).join('');
  const rateCell=(rate,kind)=>`<td class="rate ${kind}-rate"><span>${percent(rate)}</span><div class="track" aria-hidden="true"><div class="fill ${kind}-fill" style="width:${rate===null?0:Math.max(0,Math.min(100,rate*100))}%"></div></div></td>`;
  function renderTable(){
    const q=$('category-search').value.trim().toLowerCase();
    const rows=data.categories.filter(c=>[c.label,c.originalLabel||''].some(label=>label.toLowerCase().includes(q)));
    const sort=$('sort-order').value;
    if(sort==='downloads')rows.sort((a,b)=>(ratio(b.matchedDownloads,b.totalDownloads)??-1)-(ratio(a.matchedDownloads,a.totalDownloads)??-1));
    if(sort==='count')rows.sort((a,b)=>(ratio(b.matchedPackages,b.packages)??-1)-(ratio(a.matchedPackages,a.packages)??-1));
    if(sort==='gap')rows.sort((a,b)=>(b.totalDownloads-b.matchedDownloads)-(a.totalDownloads-a.matchedDownloads));
    $('category-rows').innerHTML=rows.map(c=>`<tr data-row="${escape(c.id)}"><td>${categoryLabel(c)}</td><td>${number(c.matchedPackages)} / ${number(c.packages)}</td>${rateCell(ratio(c.matchedPackages,c.packages),'count')}<td title="${number(c.matchedDownloads)} / ${number(c.totalDownloads)} 次">${yi(c.matchedDownloads)} / ${yi(c.totalDownloads)}</td>${rateCell(ratio(c.matchedDownloads,c.totalDownloads),'download')}<td title="${number(c.totalDownloads-c.matchedDownloads)} 次">${yi(c.totalDownloads-c.matchedDownloads)}</td><td><button type="button" class="detail-button" data-category="${escape(c.id)}" aria-label="查看${escape(c.label)}的明细" aria-pressed="${c.id===$('detail-category').value}">查看明细</button></td></tr>`).join('');
    $('result-count').textContent=`显示 ${rows.length} / ${data.categories.length} 个标签 · 总指标仍为Top5万全量`;
    $('no-results').hidden=rows.length!==0;
    $('table-total').innerHTML=`<tr><td>Top5万全量合计</td><td>${number(total.matchedPackages)} / ${number(total.packages)}</td><td class="count">${percent(countRate)}</td><td>${yi(total.matchedDownloads)} / ${yi(total.totalDownloads)}</td><td class="downloads">${percent(downloadRate)}</td><td>${yi(total.totalDownloads-total.matchedDownloads)}</td><td>全量</td></tr>`;
  }
  function renderDetails(){
    const c=data.categories.find(c=>c.id===$('detail-category').value);if(!c)return;
    $('detail-title').textContent=c.label+' · 详情';
    $('detail-category-help').innerHTML=window.PYTHON_CATEGORY_HELP.has(c.id)?categoryLabel(c):'';
    $('detail-summary').textContent=`库数量：${number(c.matchedPackages)} / ${number(c.packages)}（${percent(ratio(c.matchedPackages,c.packages))}）；下载量：${number(c.matchedDownloads)} / ${number(c.totalDownloads)} 次（${percent(ratio(c.matchedDownloads,c.totalDownloads))}）。未命中包 ${number(c.packages-c.matchedPackages)} 个，下载量 ${number(c.totalDownloads-c.matchedDownloads)} 次。`;
    $('missing-rows').innerHTML=c.topMissing.length?c.topMissing.map(r=>`<tr><td><a href="https://pypi.org/project/${encodeURIComponent(r.name)}/">${escape(r.name)}</a><small>${escape(r.classificationConfidence)}</small></td><td>${number(r.rank)}</td><td>${number(r.downloads)}</td></tr>`).join(''):'<tr><td colspan="3">当前分母内无未命中包</td></tr>';
    $('matched-rows').innerHTML=c.topMatched.length?c.topMatched.map(r=>`<tr><td>${escape(r.name)}</td><td>${number(r.downloads)}</td></tr>`).join(''):'<tr><td colspan="2">当前分母内无命中包</td></tr>';
    $('evidence-list').innerHTML=Object.entries(c.confidence).map(([level,b])=>`<li><span>${escape(level)}</span><span>${number(b.packages)} 个包<br>${percent(ratio(b.totalDownloads,c.totalDownloads))} 场景下载权重</span></li>`).join('');
  }
  $('category-search').addEventListener('input',renderTable);
  $('sort-order').addEventListener('change',renderTable);
  $('detail-category').addEventListener('change',()=>{renderDetails();renderTable();});
  $('category-rows').addEventListener('click',event=>{
    const button=event.target.closest('[data-category]');if(!button)return;
    if(!data.categories.some(c=>c.id===button.dataset.category))return;
    $('detail-category').value=button.dataset.category;renderDetails();renderTable();$('details').scrollIntoView({block:'start',behavior:'auto'});
  });
  $('export-data').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='python-top50000-count-and-download-coverage.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  renderTable();renderDetails();
})();
