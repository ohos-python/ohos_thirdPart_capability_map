(() => {
  'use strict';
  const data=window.SCENARIO_V1;
  if(!data){document.getElementById('groups').textContent='场景数据未加载，请确认 scenarios-v1-data.js 与页面位于同一目录。';return;}
  const STATUS={pending:'待决策',include:'本期纳入',later:'后续考虑',exclude:'暂不需要'};
  const KEY='ohos-scenario-scope-v1';
  const $=id=>document.getElementById(id);
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const counters={};
  const scenarios=data.rows.map(([domain,name,goal,chain,acceptance,tags])=>({id:`S${String(domain).padStart(2,'0')}-${String(counters[domain]=(counters[domain]||0)+1).padStart(2,'0')}`,domain,name,goal,chain,acceptance,tags,kind:'base'}));
  data.extensions.forEach(([name,goal,chain,acceptance,related,tags],i)=>scenarios.push({id:`X-${String(i+1).padStart(2,'0')}`,domain:'extension',name,goal,chain,acceptance,related,tags,kind:'extension'}));
  const ids=new Set(scenarios.map(s=>s.id));
  if(ids.size!==scenarios.length)throw new Error('Duplicate scenario IDs');
  let decisions=Object.create(null),category='all',expanded=null,storageOK=true;
  function validate(input){
    if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('决策数据必须是对象。');
    const clean=Object.create(null);
    for(const [id,item] of Object.entries(input)){
      if(!ids.has(id))throw new Error(`未知场景编号：${id}`);
      if(!item||typeof item!=='object'||!Object.hasOwn(STATUS,item.status)||typeof item.notes!=='string'||item.notes.length>1000)throw new Error(`场景 ${id} 的状态或备注无效（备注最多1000字）。`);
      clean[id]={status:item.status,notes:item.notes};
    }
    return clean;
  }
  try{const raw=localStorage.getItem(KEY);if(raw){const saved=JSON.parse(raw);if(saved.schemaVersion!==1||saved.catalogueVersion!==data.version)throw new Error('版本不匹配');decisions=validate(saved.decisions);}}
  catch(e){storageOK=false;$('save-state').textContent='浏览器存储不可用或已有记录无法读取。本次更改仅在当前页面有效，请导出JSON保存。';}
  const decision=id=>decisions[id]||{status:'pending',notes:''};
  function announce(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error);}
  function save(){
    try{if(!storageOK)throw new Error('storage unavailable');localStorage.setItem(KEY,JSON.stringify({schemaVersion:1,catalogueVersion:data.version,decisions}));$('save-state').textContent='范围决策已保存到当前浏览器。原版页面和仓库数据保持不变。';}
    catch(e){storageOK=false;$('save-state').textContent='无法写入浏览器存储。当前决策仍保留在页面中，请导出JSON备份。';}
  }
  function metrics(){
    const c={pending:0,include:0,later:0,exclude:0};scenarios.forEach(s=>c[decision(s.id).status]++);
    $('pending-count').textContent=c.pending;$('decision-summary').textContent=`本期 ${c.include} · 后续 ${c.later} · 暂不需要 ${c.exclude}`;
    $('base-count').textContent=data.rows.length;$('extension-count').textContent=data.extensions.length;
  }
  function nav(){
    const choices=[['all','全部候选场景',scenarios.length],...data.domains.map(d=>[d[0],d[1],counters[d[0]]]),['extension','跨领域候选',data.extensions.length]];
    $('domain-nav').innerHTML=choices.map(([id,name,count])=>`<button type="button" data-category="${id}" aria-pressed="${String(category)===String(id)}"><span class="nav-id">${typeof id==='number'?String(id).padStart(2,'0'):id==='all'?'≡':'＋'}</span><span>${escape(name)}</span><small>${count}</small></button>`).join('');
  }
  function card(s){
    const d=decision(s.id);
    return `<article class="scenario" data-id="${s.id}"><div class="scenario-top"><span class="scenario-id">${s.id}</span><span class="badge ${d.status}" data-badge="${s.id}">${STATUS[d.status]}</span></div><h4>${escape(s.name)}</h4><p class="goal">${escape(s.goal)}</p><div class="tags">${s.tags.split(';').map(t=>`<span class="tag">${escape(t)}</span>`).join('')}</div><div class="scope-row"><label for="scope-${s.id}">范围决策</label><select id="scope-${s.id}" data-scope="${s.id}" aria-label="${escape(s.name)}的范围决策">${Object.entries(STATUS).map(([value,label])=>`<option value="${value}"${value===d.status?' selected':''}>${label}</option>`).join('')}</select></div><details class="scenario-detail"><summary>能力链、验收与决策备注${d.notes?' · 已备注':''}</summary><dl><dt>所需能力链</dt><dd>${escape(s.chain)}</dd><dt>端到端验收结果</dt><dd>${escape(s.acceptance)}</dd>${s.related?`<dt>关联能力类别</dt><dd>${escape(s.related)} 类；行业组合是否独立成类待决策。</dd>`:''}<dt>当前适配状态</dt><dd>未评估。此处是验收目标，不是已通过的测试结果。</dd></dl><label for="notes-${s.id}">决策理由 / 边界 / 需要补充的任务</label><textarea id="notes-${s.id}" data-notes="${s.id}" maxlength="1000" rows="2" placeholder="例如：本期仅支持离线文件处理，暂不接入外部账号。">${escape(d.notes)}</textarea><p class="scenario-note">默认不预设优先级；暂不需要的场景仍保留记录。</p></details></article>`;
  }
  function render(){
    const q=$('search').value.trim().toLocaleLowerCase(),status=$('status-filter').value;
    const visible=scenarios.filter(s=>(category==='all'||String(s.domain)===String(category))&&(status==='all'||decision(s.id).status===status)&&(!q||[s.id,s.name,s.goal,s.chain,s.acceptance,s.tags,s.related,decision(s.id).notes].join(' ').toLocaleLowerCase().includes(q)));
    const sections=[...data.domains,['extension','跨领域候选','暂不排除这些场景。它们跨越多个能力大类，先作为行业组合保留，再决定是否纳入或单独成类。','按行业需求组合语言与底层能力']];
    $('groups').innerHTML=sections.map(([id,name,boundary,langs])=>{
      const rows=visible.filter(s=>s.domain===id);if(!rows.length)return '';
      const open=expanded===null?(category!=='all'||!!q||status!=='all'||id===12):expanded;
      return `<details class="domain-group" data-domain="${id}"${open?' open':''}><summary><span class="domain-number">${id==='extension'?'＋':String(id).padStart(2,'0')}</span><div class="group-label"><h3>${escape(name)}</h3><p>${id==='extension'?'行业组合，不是新增第16类':'候选任务 · 所需能力 · 可观察的验收结果'}</p></div><span class="domain-count">${rows.length} 个场景</span></summary><div class="domain-intro"><p><strong>分类边界：</strong>${escape(boundary)}</p><p><strong>语言生态参考：</strong>${escape(langs)}。不表示这些语言或相关库已在鸿蒙完成适配。</p></div><div class="scenario-grid">${rows.map(card).join('')}</div></details>`;
    }).join('');
    $('empty').hidden=!!visible.length;$('result-count').textContent=`显示 ${visible.length} / ${scenarios.length} 个场景`;
    $('catalogue-title').textContent=category==='all'?'候选场景总览':category==='extension'?'跨领域候选':data.domains.find(d=>String(d[0])===String(category))[1];nav();metrics();
  }
  $('domain-nav').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;expanded=null;render();if(matchMedia('(max-width:760px)').matches)$('catalogue').scrollIntoView();});
  $('search').addEventListener('input',()=>{expanded=null;render();});
  $('status-filter').addEventListener('change',()=>{expanded=null;render();});
  $('clear-filter').addEventListener('click',()=>{category='all';expanded=null;$('search').value='';$('status-filter').value='all';render();});
  $('expand-all').addEventListener('click',()=>{expanded=true;document.querySelectorAll('.domain-group').forEach(g=>g.open=true);});
  $('collapse-all').addEventListener('click',()=>{expanded=false;document.querySelectorAll('.domain-group').forEach(g=>g.open=false);});
  $('groups').addEventListener('change',e=>{const id=e.target.dataset.scope;if(!id)return;decisions[id]={...decision(id),status:e.target.value};save();metrics();if($('status-filter').value!=='all'){render();}else{const badge=document.querySelector(`[data-badge="${id}"]`);badge.textContent=STATUS[e.target.value];badge.className='badge '+e.target.value;}});
  $('groups').addEventListener('input',e=>{const id=e.target.dataset.notes;if(!id)return;decisions[id]={...decision(id),notes:e.target.value};save();});
  $('export').addEventListener('click',()=>{
    const payload={schemaVersion:1,catalogueVersion:data.version,exportedAt:new Date().toISOString(),scope:'范围决策，不代表鸿蒙适配状态',domains:data.domains,scenarios:scenarios.map(s=>({...s,adaptationStatus:'未评估'})),decisions:Object.fromEntries(scenarios.map(s=>[s.id,decision(s.id)]))};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`ohos-scenario-v1-decisions-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('已导出完整候选场景与当前范围决策。请保存下载文件，便于后续合并或换设备继续。');
  });
  $('import').addEventListener('click',()=>$('import-file').click());
  $('import-file').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{if(file.size>1024*1024)throw new Error('文件超过1MB限制。');const parsed=JSON.parse(await file.text());if(parsed.schemaVersion!==1||parsed.catalogueVersion!==data.version)throw new Error('目录版本不匹配，请使用本V1页面导出的文件。');const incoming=validate(parsed.decisions);const count=Object.keys(incoming).length;if(!count)throw new Error('没有可导入的决策。');if(!confirm(`将合并 ${count} 个场景的决策与备注，同编号已有决策会被覆盖。原版地图不受影响。是否继续？`))return;for(const [id,d]of Object.entries(incoming))decisions[id]=d;save();render();announce(`已合并 ${count} 个场景的范围决策。`);}
    catch(error){announce('导入失败，已有决策未变更：'+error.message,true);}finally{e.target.value='';}
  });
  render();
})();
