(() => {
  'use strict';
  const data=window.SCENARIO_V1;
  if(!data){document.getElementById('groups').textContent='场景数据未加载，请确认 scenarios-v1-data.js 与页面位于同一目录。';return;}
  const coverage=window.SCENARIO_V1_COVERAGE||{domains:{},unit:'项目依赖引用',scope:'覆盖统计数据未加载。'};
  const libraryData=window.SCENARIO_V1_LIBRARY_CANDIDATES||{domains:{},definition:'全量候选数据未加载。'};
  const STATUS={pending:'待决策',include:'本期纳入',later:'后续考虑',exclude:'暂不需要'};
  const LIBRARY_STATUS={completed:'已完成', 'in-progress':'进行中',partial:'部分完成',gap:'确认缺口',review:'待核验','data-missing':'数据缺失'};
  const LANGUAGE_LABEL={'JavaScript/TypeScript':'JS/TS','C/C++':'C/C++',Python:'Python',Go:'Go',Java:'Java',Rust:'Rust'};
  const KEY='ohos-scenario-scope-v1';
  const $=id=>document.getElementById(id);
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=value=>/^https?:\/\/[^\s]+$/i.test(String(value||''))?String(value):'';
  const missingEvidence=new Map((data.ecosystemEvidence||[]).filter(e=>e.status==='missing-data').map(e=>[e.ecosystem,e]));
  const domainLanguages=new Map(data.domains.map(d=>[String(d[0]),d[3]]));
  const languageTokens=value=>new Set(String(value||'').match(/[A-Za-z][A-Za-z+#.]*/g)||[]);
  function missingFor(s){
    const references=s.kind==='extension'?String(s.related||'').split('/').map(id=>domainLanguages.get(id)||'').join(' '):domainLanguages.get(String(s.domain))||'';
    const tokens=languageTokens(references);
    return [...missingEvidence.values()].filter(item=>tokens.has(item.ecosystem));
  }
  function coverageFor(s){
    const ids=s.kind==='extension'?String(s.related||'').split('/'): [String(s.domain)];
    const result={projects:0,languages:{},involved:0,completed:0,gap:0};
    for(const id of ids){
      const item=coverage.domains[id];if(!item)continue;
      result.projects+=item.projects;result.involved+=item.involved;result.completed+=item.completed;result.gap+=item.gap;
      for(const [language,count] of Object.entries(item.languages||{}))result.languages[language]=(result.languages[language]||0)+count;
    }
    return result;
  }
  function primaryLanguages(item){
    const rows=Object.entries(item.languages);if(!rows.length)return '待补充';
    const max=Math.max(...rows.map(([,count])=>count));
    return rows.filter(([,count])=>count===max).map(([language])=>language==='JavaScript/TypeScript'?'JS/TS':language).join(' / ');
  }
  const candidateCache=new Map();
  function candidatesFor(s){
    if(candidateCache.has(s.id))return candidateCache.get(s.id);
    const result=(libraryData.scenarios?.[s.id]?.libraries||[]).map(reference=>({...libraryData.libraries?.[reference.key],...reference}));
    candidateCache.set(s.id,result);return result;
  }
  function candidateLanguageStats(candidates){return candidates.reduce((result,item)=>(result[item.ecosystem]=(result[item.ecosystem]||0)+1,result),{});}
  function primaryCandidateLanguages(candidates){return primaryLanguages({languages:candidateLanguageStats(candidates)});}
  const counters={};
  const scenarios=data.rows.map(([domain,name,goal,chain,acceptance,tags])=>({id:`S${String(domain).padStart(2,'0')}-${String(counters[domain]=(counters[domain]||0)+1).padStart(2,'0')}`,domain,name,goal,chain,acceptance,tags,kind:'base'}));
  data.extensions.forEach(([name,goal,chain,acceptance,related,tags],i)=>scenarios.push({id:`X-${String(i+1).padStart(2,'0')}`,domain:'extension',name,goal,chain,acceptance,related,tags,kind:'extension'}));
  const scenarioById=new Map(scenarios.map(s=>[s.id,s]));
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
    const summary=libraryData.summary||{},registry=libraryData.registryMetadata||{};
    $('identified-library-count').textContent=(summary.uniqueLibraries||0).toLocaleString('zh-CN');
    $('function-match-count').textContent=(summary.functionMatchedRelations||0).toLocaleString('zh-CN');
    $('fallback-count').textContent=(summary.fallbackRelations||0).toLocaleString('zh-CN');
    $('registry-description-count').textContent=(registry.resolved||0).toLocaleString('zh-CN');
  }
  function nav(){
    const choices=[['all','全部候选场景',scenarios.length],...data.domains.map(d=>[d[0],d[1],counters[d[0]]]),['extension','跨领域候选',data.extensions.length]];
    $('domain-nav').innerHTML=choices.map(([id,name,count])=>`<button type="button" data-category="${id}" aria-pressed="${String(category)===String(id)}"><span class="nav-id">${typeof id==='number'?String(id).padStart(2,'0'):id==='all'?'≡':'＋'}</span><span>${escape(name)}</span><small>${count}</small></button>`).join('');
  }
  function candidateCounts(candidates){return candidates.reduce((result,item)=>(result[item.status]=(result[item.status]||0)+1,result),{});}
  function renderCandidateResults(details,query=''){
    const scenario=scenarioById.get(details.dataset.scenarioId),candidates=candidatesFor(scenario),needle=query.trim().toLocaleLowerCase();
    const visible=needle?candidates.filter(item=>[item.name,item.ecosystem,LANGUAGE_LABEL[item.ecosystem],item.function,item.functionBasis,...item.functionKeywords||[],item.scenarioAssignmentBasis,item.scenarioConfidence,item.languageBasis,item.status,LIBRARY_STATUS[item.status]].join(' ').toLocaleLowerCase().includes(needle)):candidates;
    details.querySelector('[data-candidate-count]').textContent=`显示 ${visible.length} / ${candidates.length}`;
    details.querySelector('[data-candidate-list]').innerHTML=visible.map(item=>{const url=safeUrl(item.functionSourceUrl),assignment=item.scenarioAssignment==='domain-fallback'?'需复核':'功能匹配';return `<li><div class="candidate-main"><code>${escape(item.name)}</code><span class="candidate-function">${escape(item.function||'当前来源没有逐库功能说明')}</span><small><strong>${assignment}</strong> · ${escape(item.scenarioAssignmentBasis||'场景依据缺失')} · ${escape(item.functionBasis||'功能证据缺失')}${url?` · <a href="${escape(url)}" target="_blank" rel="noopener noreferrer">查看功能来源</a>`:''}</small></div><span class="candidate-language" title="${escape(item.languageBasis||'来源语言待核验')}">${escape(LANGUAGE_LABEL[item.ecosystem]||item.ecosystem||'未知')}</span><span class="candidate-projects">${item.projects} 个项目</span><span class="library-status ${escape(item.status)}">${escape(LIBRARY_STATUS[item.status]||'待核验')}</span></li>`;}).join('')||'<li class="candidate-empty">当前没有根据功能识别到本场景的三方库。</li>';
  }
  function ensureCandidateContent(details){
    const content=details.querySelector('[data-candidate-content]');if(content.dataset.ready)return;
    content.dataset.ready='true';
    const registry=libraryData.registryMetadata||{};
    content.innerHTML=`<p>${escape(libraryData.definition)}</p><p>${escape(libraryData.denominatorDefinition||'')}</p><p>${escape(libraryData.evidenceLimit||'')}</p>${registry.requested?`<p><strong>联网功能证据：</strong>已取得官方描述 ${registry.resolved} / ${registry.requested}；条目存在但无描述 ${registry.missingDescription||0}；未找到 ${registry.notFound||0}；请求失败 ${registry.failed||0}。</p>`:''}<div class="candidate-tools"><label>筛选本场景识别库<input type="search" data-candidate-search placeholder="输入库名、语言、功能、分配依据或状态"></label><span data-candidate-count></span></div><ul data-candidate-list></ul><small>“功能匹配”来自可追溯描述与场景词；“需复核”是无细分功能命中时按项目大类回退。两者都不自动等于鸿蒙真机验证通过。</small>`;
    renderCandidateResults(details);
  }
  function card(s){
    const d=decision(s.id);
    const missing=missingFor(s),names=missing.map(e=>e.ecosystem);
    const candidates=candidatesFor(s);
    const sourcePrimary=primaryCandidateLanguages(candidates);
    const counts=candidateCounts(candidates),completed=counts.completed||0,inProgress=counts['in-progress']||0,confirmedGap=counts.gap||0;
    const assignments=libraryData.scenarios?.[s.id]?.assignmentCounts||{},functionMatched=(assignments['function-match']||0)+(assignments['extension-function-match']||0),fallback=assignments['domain-fallback']||0;
    const evidence=missing.length?`<p class="evidence-missing"><strong>参考生态数据缺失：</strong>${names.map(escape).join('、')}；暂不参与当前适配判断，不代表本场景缺失。</p>`:'';
    const coverageTags=`<div class="coverage-tags" aria-label="当前场景三方库统计"><span class="coverage-language">主要来源语言 ${escape(sourcePrimary)}</span><span>识别库 ${candidates.length}</span><span class="coverage-done">已完成 ${completed}</span><span class="coverage-progress">进行中 ${inProgress}</span><span class="coverage-gap">缺口 ${confirmedGap}</span></div>`;
    const candidateList=`<details class="candidate-libraries" data-scenario-id="${s.id}"><summary>本场景识别三方库 <span>${candidates.length}</span></summary><div class="candidate-status-summary"><span class="completed">已完成 ${completed}</span><span class="in-progress">进行中 ${inProgress}</span><span class="gap">确认缺口 ${confirmedGap}</span><span class="data-missing">数据缺失 ${counts['data-missing']||0}</span><span>功能匹配 ${functionMatched}</span><span class="review">需复核 ${fallback}</span></div><div class="candidate-content" data-candidate-content></div></details>`;
    return `<article class="scenario" data-id="${s.id}"${missing.length?` data-missing-ecosystems="${names.map(escape).join(',')}"`:''}><div class="scenario-top"><span class="scenario-id">${s.id}</span><span class="badge ${d.status}" data-badge="${s.id}">${STATUS[d.status]}</span></div><h4>${escape(s.name)}</h4><p class="goal">${escape(s.goal)}</p><div class="tags">${s.tags.split(';').map(t=>`<span class="tag">${escape(t)}</span>`).join('')}</div>${coverageTags}${evidence}${candidateList}<div class="scope-row"><label for="scope-${s.id}">范围决策</label><select id="scope-${s.id}" data-scope="${s.id}" aria-label="${escape(s.name)}的范围决策">${Object.entries(STATUS).map(([value,label])=>`<option value="${value}"${value===d.status?' selected':''}>${label}</option>`).join('')}</select></div><details class="scenario-detail"><summary>能力链、验收与决策备注${d.notes?' · 已备注':''}</summary><dl><dt>所需能力链</dt><dd>${escape(s.chain)}</dd><dt>端到端验收结果</dt><dd>${escape(s.acceptance)}</dd>${s.related?`<dt>关联能力类别</dt><dd>${escape(s.related)} 类；行业组合是否独立成类待决策。</dd>`:''}<dt>当前三方库统计</dt><dd>按“来源生态 + 库名”去重识别 ${candidates.length} 个：功能明确匹配 ${functionMatched} 个、需复核 ${fallback} 个；已完成 ${completed} 个、进行中 ${inProgress} 个、确认缺口 ${confirmedGap} 个、生态数据缺失 ${counts['data-missing']||0} 个。</dd>${missing.length?`<dt>参考生态证据</dt><dd>${names.map(escape).join('、')} 当前完成目录数据缺失，功能分配不代表已适配。</dd>`:''}<dt>当前适配状态</dt><dd>未评估。库目录命中和场景功能分配都不是端到端测试结果。</dd></dl><label for="notes-${s.id}">决策理由 / 边界 / 需要补充的任务</label><textarea id="notes-${s.id}" data-notes="${s.id}" maxlength="1000" rows="2" placeholder="例如：本期仅支持离线文件处理，暂不接入外部账号。">${escape(d.notes)}</textarea><p class="scenario-note">场景由官方/目录功能描述匹配；无功能词命中的回退项明确标记“需复核”。</p></details></article>`;
  }
  function render(){
    const q=$('search').value.trim().toLocaleLowerCase(),status=$('status-filter').value;
    const visible=scenarios.filter(s=>{
      const candidates=candidatesFor(s),primary=primaryCandidateLanguages(candidates),completed=candidateCounts(candidates).completed||0;
      const counts=candidateCounts(candidates);
      return (category==='all'||String(s.domain)===String(category))&&(status==='all'||decision(s.id).status===status)&&(!q||[s.id,s.name,s.goal,s.chain,s.acceptance,s.tags,s.related,primary,`识别库 ${candidates.length} 已完成 ${completed} 进行中 ${counts['in-progress']||0} 确认缺口 ${counts.gap||0}`,...candidates.flatMap(item=>[item.name,item.function,item.scenarioAssignmentBasis]),...missingFor(s).map(e=>e.ecosystem+' 数据缺失'),decision(s.id).notes].join(' ').toLocaleLowerCase().includes(q));
    });
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
  $('groups').addEventListener('click',e=>{const summary=e.target.closest?.('.candidate-libraries > summary');if(!summary)return;const details=summary.parentElement;if(!details.open)setTimeout(()=>ensureCandidateContent(details),0);});
  $('groups').addEventListener('change',e=>{const id=e.target.dataset.scope;if(!id)return;decisions[id]={...decision(id),status:e.target.value};save();metrics();if($('status-filter').value!=='all'){render();}else{const badge=document.querySelector(`[data-badge="${id}"]`);badge.textContent=STATUS[e.target.value];badge.className='badge '+e.target.value;}});
  $('groups').addEventListener('input',e=>{if(!e.target.dataset.candidateSearch)return;renderCandidateResults(e.target.closest('.candidate-libraries'),e.target.value);});
  $('groups').addEventListener('input',e=>{const id=e.target.dataset.notes;if(!id)return;decisions[id]={...decision(id),notes:e.target.value};save();});
  $('export').addEventListener('click',()=>{
    const payload={schemaVersion:1,catalogueVersion:data.version,exportedAt:new Date().toISOString(),scope:'范围决策，不代表鸿蒙适配状态',ecosystemEvidence:data.ecosystemEvidence||[],coverageEvidence:coverage,libraryCandidates:libraryData,domains:data.domains,scenarios:scenarios.map(s=>({...s,adaptationStatus:'未评估'})),decisions:Object.fromEntries(scenarios.map(s=>[s.id,decision(s.id)]))};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`ohos-scenario-v1-decisions-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('已导出完整候选场景与当前范围决策。请保存下载文件，便于后续合并或换设备继续。');
  });
  $('import').addEventListener('click',()=>$('import-file').click());
  $('import-file').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{if(file.size>5*1024*1024)throw new Error('文件超过5MB限制。');const parsed=JSON.parse(await file.text());if(parsed.schemaVersion!==1||parsed.catalogueVersion!==data.version)throw new Error('目录版本不匹配，请使用本V1页面导出的文件。');const incoming=validate(parsed.decisions);const count=Object.keys(incoming).length;if(!count)throw new Error('没有可导入的决策。');if(!confirm(`将合并 ${count} 个场景的决策与备注，同编号已有决策会被覆盖。原版地图不受影响。是否继续？`))return;for(const [id,d]of Object.entries(incoming))decisions[id]=d;save();render();announce(`已合并 ${count} 个场景的范围决策。`);}
    catch(error){announce('导入失败，已有决策未变更：'+error.message,true);}finally{e.target.value='';}
  });
  render();
})();
