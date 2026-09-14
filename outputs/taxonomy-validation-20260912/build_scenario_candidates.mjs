import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const readJs=async file=>{
  const source=await fs.readFile(file,'utf8');
  return JSON.parse(source.slice(source.indexOf('=')+1).trim().replace(/;$/,''));
};
const readScenarioData=async file=>{
  const context={window:{}};
  vm.createContext(context);
  vm.runInContext(await fs.readFile(file,'utf8'),context);
  return context.window.SCENARIO_V1;
};

const [source,analysis,pythonCatalog,cCatalog,satisfaction,registryMetadata,scenarioData]=await Promise.all([
  read(path.join(here,'local-source.json')),
  read(path.join(here,'analysis.json')),
  readJs(path.join(root,'python-library-capabilities.js')),
  readJs(path.join(root,'c-library-capabilities.js')),
  readJs(path.join(root,'third-party-satisfaction-cleaned-v2.js')),
  read(path.join(here,'registry-metadata.json')).catch(()=>({packages:{},updatedAt:null})),
  readScenarioData(path.join(root,'scenarios-v1-data.js'))
]);

const pythonName=name=>String(name).toLowerCase().replace(/[-_.]+/g,'-');
const cName=name=>String(name).toLowerCase().replace(/^lib(?=[a-z0-9])/,'').replace(/[^a-z0-9]+/g,'');
const pythonByName=new Map(pythonCatalog.libraries.map(item=>[pythonName(item.n),item]));
const pythonCategories=new Map(pythonCatalog.categories.map(item=>[item.id,item]));
const cByName=new Map(cCatalog.libraries.map(item=>[cName(item.name),item]));
const missingEcosystems=new Set(['Go','Java','Rust']);
const localById=new Map(analysis.locals.map(item=>[item.id,item]));
const groups=Object.fromEntries(analysis.domains.map(domain=>[domain.id,new Map()]));
const registryFor=(name,eco)=>registryMetadata.packages?.[`${eco}|${String(name).toLocaleLowerCase('en-US')}`];
const cleaningByOriginal=new Map((satisfaction.cleaningExamples||[]).map(item=>[`${item.originalEcosystem}|${String(item.originalName).toLocaleLowerCase('en-US').trim()}`,item]));
const dependencyName=(name,eco)=>eco==='JavaScript/TypeScript'
  ?String(name).replace(/\s+(?:[~^<>=*]?\d.*)$/,'').trim()
  :String(name).trim();

// Transparent, reviewable functional vocabulary. It scores all 120 base
// scenarios globally. The project's capability domain is used only when the
// function evidence has no usable hit. Every match keeps the official
// description and matched terms as evidence.
const baseRuleSpec=`
S01-01|log,logger,logging,exception,error tracking,stack trace
S01-02|config,configuration,environment variable,dotenv,command argument,settings
S01-03|algorithm,data structure,collection,cache eviction,utility,utilities,helpers,lodash
S01-04|regex,regular expression,text processing,unicode,encoding,string,parser
S01-05|date,time zone,timezone,calendar,datetime,duration
S01-06|json,yaml,xml,toml,serialization,schema,validation,marshal
S01-07|internationalization,localization,i18n,l10n,translation,locale
S01-08|decimal,precision,unit conversion,uuid,identifier,currency,arbitrary precision
S02-01|filesystem,file system,file watcher,directory,path,glob
S02-02|compression,archive,zip,tar,gzip,zstd,lz4,unpack
S02-03|shell,subprocess,process execution,terminal,pty,command runner
S02-04|async,concurrency,thread,promise,coroutine,parallel,worker
S02-05|ipc,inter-process,shared memory,message bus,named pipe
S02-06|ffi,native extension,binding,abi,foreign function,node-gyp,ctypes
S02-07|runtime,wasm,webassembly,virtual machine,portable execution,interpreter
S02-08|hardware,device,usb,serial,gpio,sensor,bluetooth,driver
S03-01|http,https,rest client,api client,download,upload,file transfer,curl
S03-02|websocket,socket.io,realtime message,real-time message
S03-03|tcp,udp,network socket,datagram
S03-04|rpc,grpc,remote procedure,service mesh
S03-05|mqtt,amqp,coap,device protocol,message protocol
S03-06|email,smtp,imap,pop3,mail
S03-07|proxy,dns,service discovery,mdns,network discovery
S03-08|webrtc,video call,audio call,real-time communication
S04-01|crypto,cryptography,encryption,hash,signature,cipher
S04-02|tls,ssl,certificate,x509,public key infrastructure
S04-03|oauth,openid,oidc,sso,login,authentication,identity provider
S04-04|authorization,permission,rbac,role,multi-tenant,access control
S04-05|secret,credential,keyring,vault,key management,password manager
S04-06|vulnerability,sbom,supply chain,dependency scan,license scan,security audit
S04-07|privacy,redaction,masking,pii,compliance,data audit
S04-08|sandbox,untrusted,isolation,malware,input validation,resource limit
S05-01|sqlite,embedded database,local database,leveldb,rocksdb
S05-02|sql,postgres,mysql,mariadb,oracle,orm,database driver,relational
S05-03|nosql,mongodb,cassandra,dynamodb,key-value,key value,document database
S05-04|redis,memcached,cache,distributed state
S05-05|object storage,s3,blob storage,minio,file storage
S05-06|full text,full-text,search engine,indexing,elasticsearch,solr,lucene
S05-07|vector database,embedding store,graph database,similarity search,knowledge graph
S05-08|migration,replication,backup,database sync,restore
S06-01|web framework,api framework,rest api,graphql,router,backend framework,django,middleware,application server
S06-02|cms,content management,website,blog,static site
S06-03|task queue,job queue,background job,worker queue,celery
S06-04|scheduler,cron,scheduled job,periodic task
S06-05|workflow,approval,business process,state machine
S06-06|event driven,event-driven,integration,event bus,webhook,message broker
S06-07|transaction,billing,payment,order,commerce,business rule
S06-08|notification,push notification,email delivery,sms,messaging service
S07-01|ui component,web component,frontend,front-end,react,vue,svelte,angular,css
S07-02|desktop,electron,native window,cross-platform app
S07-03|mobile,android,ios,react native,flutter,mobile ui
S07-04|command line,command-line,cli,terminal command
S07-05|tui,terminal ui,terminal user interface,curses,interactive terminal
S07-06|editor,rich text,canvas,diagram,code editor,drawing,prosemirror
S07-07|accessibility,a11y,screen reader,speech input,keyboard navigation
S07-08|design system,theme,component library,icon,i18n ui,tailwind
S08-01|etl,data cleaning,dataframe,data pipeline,csv,parquet,data import
S08-02|statistics,analytics,exploratory analysis,probability,data analysis
S08-03|linear algebra,numerical,matrix,array computing,scientific computing,calculus
S08-04|visualization,chart,plot,graphing,dashboard
S08-05|time series,signal processing,fft,spectrum,waveform
S08-06|optimization,solver,simulation,operations research,linear programming
S08-07|gis,geospatial,map,geography,coordinate,spatial
S08-08|distributed data,big data,spark,hadoop,cluster computing
S09-01|image processing,image manipulation,png,jpeg,webp,pillow
S09-02|video processing,transcode,codec,ffmpeg,media conversion
S09-03|audio processing,audio playback,recording,sound,music
S09-04|camera,screen capture,video playback,webcam,screen recording
S09-05|2d,vector graphics,font,svg,drawing,rasterizer
S09-06|3d,webgl,opengl,gpu rendering,three.js,3d model
S09-07|game,physics engine,realtime interaction,real-time interaction
S09-08|cad,geometry,engineering drawing,mesh,solid modeling
S10-01|word document,docx,microsoft word,wordprocessing
S10-02|excel,spreadsheet,xlsx,formula,workbook
S10-03|powerpoint,presentation,pptx,slide deck
S10-04|pdf,portable document,annotation
S10-05|document conversion,document rendering,converter,office format
S10-06|ocr,scanned document,document extraction,form extraction
S10-07|ebook,epub,publishing,typesetting,latex,markdown
S10-08|document template,document diff,document version,templating
S11-01|openai,anthropic,model api,llm api,ai provider,generative ai api
S11-02|inference,onnxruntime,local model,model serving,gpu acceleration
S11-03|training,fine-tuning,fine tuning,deep learning,machine learning framework
S11-04|embedding,rerank,similarity,sentence transformer
S11-05|computer vision,object detection,image recognition,ocr,opencv
S11-06|speech recognition,text to speech,text-to-speech,audio transcription,asr,tts
S11-07|multimodal,image generation,video generation,generative media,diffusion
S11-08|quantization,model evaluation,benchmark,model format,model conversion
S12-01|browser automation,selenium,playwright,puppeteer,web testing
S12-02|word automation,microsoft word automation
S12-03|excel automation,spreadsheet automation
S12-04|powerpoint automation,presentation automation
S12-05|calendar automation,email automation,collaboration app
S12-06|desktop automation,gui automation,mouse,keyboard,input automation,window control
S12-07|screen recognition,visual locator,screenshot recognition,computer vision automation
S12-08|workflow automation,robotic process automation,rpa,cross-application
S13-01|agent framework,ai agent,autonomous agent,tool-using agent
S13-02|mcp,model context protocol,connector,tool registry,function calling
S13-03|rag,retrieval augmented,question answering,knowledge base
S13-04|agent memory,conversation memory,chat history,context management
S13-05|multi-agent,multi agent,agent collaboration,swarm
S13-06|checkpoint,durable execution,persistent workflow,resume,recovery
S13-07|human in the loop,human-in-the-loop,guardrail,approval,safety policy
S13-08|agent evaluation,agent tracing,skill,evals,prompt evaluation
S14-01|package manager,dependency management,artifact repository,package registry
S14-02|compiler,build tool,bundler,bundle,rollup,packaging,cross compilation,linker
S14-03|ide,language server,lsp,debugger,debugging
S14-04|linter,formatter,static analysis,refactor,code quality,parser,tree-sitter,syntax highlighting,grammar
S14-05|unit test,integration test,end-to-end test,e2e,test framework,test runner,testing
S14-06|benchmark,profiling,memory test,load test,performance test,reliability
S14-07|documentation,architecture diagram,requirements,engineering document
S14-08|coding agent,code generation,code assistant,automated code,git agent
S15-01|release,installer,application update,distribution,publish,deployment package
S15-02|process manager,service manager,daemon,server management,supervisor
S15-03|container,kubernetes,docker,virtualization,cluster deployment
S15-04|infrastructure as code,configuration management,ansible,terraform,provisioning
S15-05|log aggregation,log search,audit log,logging platform
S15-06|monitoring,observability,metrics,tracing,alerting,telemetry,apm
S15-07|disaster recovery,backup,recovery,fault injection,chaos engineering
S15-08|cost management,capacity planning,quota,resource governance,finops
`;
const extensionRuleSpec=`
X-01|iot,smart home,home automation,homekit,zigbee,matter
X-02|robot,robotics,autonomous system,slam,ros
X-03|industrial,edge computing,plc,modbus,opc ua
X-04|blockchain,web3,ethereum,distributed ledger,cryptocurrency
X-05|finance,trading,stock,market data,quantitative,banking
X-06|medical,healthcare,health,biology,bioinformatics,clinical
X-07|high performance computing,hpc,scientific simulation,gpu computing
X-08|digital twin,geospatial,gis,3d map,spatial
X-09|ecommerce,e-commerce,erp,crm,enterprise management,shopping
X-10|social,community,collaboration,collaborative editing,chat
X-11|education,learning,exam,course,school
X-12|recommendation,recommender,content delivery,search engine
X-13|logistics,transportation,traffic,route planning,location service
X-14|eda,electronic design,embedded development,microcontroller,firmware
X-15|xr,virtual reality,augmented reality,game engine,creative tool
`;
const parseRules=spec=>new Map(spec.trim().split('\n').map(line=>{const [id,terms]=line.split('|');return [id,terms.split(',').map(value=>value.trim()).filter(Boolean)];}));
const baseRules=parseRules(baseRuleSpec);
const extensionRules=parseRules(extensionRuleSpec);
const domainDefaults={1:'S01-03',2:'S02-07',3:'S03-01',4:'S04-01',5:'S05-02',6:'S06-01',7:'S07-01',8:'S08-01',9:'S09-01',10:'S10-05',11:'S11-01',12:'S12-06',13:'S13-01',14:'S14-01',15:'S15-02'};
const normalizeText=value=>String(value||'').toLocaleLowerCase('en-US').replace(/[_/.-]+/g,' ').replace(/\s+/g,' ').trim();
const termHit=(text,term)=>{const value=normalizeText(term);return value.length<=3?new RegExp(`(^|[^a-z0-9])${value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^a-z0-9]|$)`,'i').test(text):text.includes(value);};
const functionText=item=>normalizeText([item.name,item.function,...item.functionKeywords||[]].join(' '));
const scoreRule=(text,terms)=>{const hits=terms.filter(term=>termHit(text,term));return {score:hits.reduce((sum,term)=>sum+1+Math.min(2,normalizeText(term).length/12),0),hits};};

function ecosystem(row,project){
  const value=row.language||project?.primaryLanguage||'';
  if(value==='Python')return 'Python';
  if(value==='JavaScript/TypeScript')return 'JavaScript/TypeScript';
  if(value==='C/C++')return 'C/C++';
  return value||'未知';
}
function statusFor(name,eco){
  if(missingEcosystems.has(eco))return 'data-missing';
  if(eco==='Python')return pythonByName.has(pythonName(name))?'completed':'gap';
  if(eco==='C/C++'||eco==='JavaScript/TypeScript')return 'in-progress';
  return 'review';
}
function functionEvidence(name,eco){
  const registry=registryFor(name,eco);
  if(registry?.httpStatus===200&&registry.description)return {
    function:registry.description,
    functionBasis:`${registry.registry}官方注册表元数据`,
    functionSourceUrl:registry.registryUrl,
    functionFetchedAt:registryMetadata.updatedAt,
    functionKeywords:registry.keywords||[]
  };
  if(registry?.httpStatus===200)return {
    function:`${registry.registry}存在该条目，但未提供简要功能描述`,
    functionBasis:`${registry.registry}官方条目（描述缺失）`,
    functionSourceUrl:registry.registryUrl,
    functionFetchedAt:registryMetadata.updatedAt,
    functionKeywords:registry.keywords||[]
  };
  if(eco==='Python'){
    const library=pythonByName.get(pythonName(name));
    if(!library)return {function:'当前Python完成目录未检出，功能来源待补充',functionBasis:'无逐库功能证据'};
    const category=pythonCategories.get(library.c);
    return {function:category?`${category.label}：${category.interfaceSurface}`:'Python目录已有条目，具体功能待补充',functionBasis:'Python目录分类说明',functionSourceUrl:'',functionFetchedAt:null,functionKeywords:[]};
  }
  if(eco==='C/C++'){
    const library=cByName.get(cName(name));
    if(!library)return {function:'当前C/C++工作目录未检出，功能来源待补充',functionBasis:'无逐库功能证据'};
    return {function:library.description||'C/C++目录已有条目，具体功能说明缺失',functionBasis:library.description?'C/C++目录原始描述':'C/C++目录条目',functionSourceUrl:library.repository||'',functionFetchedAt:null,functionKeywords:[]};
  }
  if(eco==='JavaScript/TypeScript')return {function:'npm官方注册表未返回可用的逐库功能描述',functionBasis:'npm元数据缺失',functionSourceUrl:registry?.registryUrl||'',functionFetchedAt:registryMetadata.updatedAt,functionKeywords:[]};
  if(missingEcosystems.has(eco))return {function:`当前仓库没有${eco}适配目录和逐库功能元数据`,functionBasis:`${eco}数据缺失`,functionSourceUrl:'',functionFetchedAt:null,functionKeywords:[]};
  return {function:'当前来源没有逐库功能说明',functionBasis:'功能证据缺失',functionSourceUrl:'',functionFetchedAt:null,functionKeywords:[]};
}

const satisfactionProjects=new Map(satisfaction.projects.map(item=>[item.project.toLowerCase(),item]));
for(const row of source){
  const classified=localById.get(row.id);
  if(!classified?.eligible||classified.duplicateOf||!classified.cat||!groups[classified.cat])continue;
  const project=satisfactionProjects.get(row.project.toLowerCase());
  const eco=ecosystem(row,project);
  const dependencies=String(row.dependencies||'').split(',').map(value=>value.trim()).filter(value=>value&&value!=='N/A');
  const seen=new Set();
  for(const originalName of dependencies){
    const correction=cleaningByOriginal.get(`${eco}|${originalName.toLocaleLowerCase('en-US')}`);
    if(correction&&!correction.valid)continue;
    const dependencyEcosystem=correction?.ecosystem||eco;
    const name=dependencyName(correction?.name||originalName,dependencyEcosystem);
    const key=`${dependencyEcosystem}|${name}`.toLowerCase();
    if(seen.has(key))continue;
    seen.add(key);
    const group=groups[classified.cat];
    const item=group.get(key)||{
      name,
      ecosystem:dependencyEcosystem,
      languageBasis:correction&&correction.ecosystem!==eco?`依赖清洗纠正：${eco} → ${dependencyEcosystem}`:'项目记录主语言；尚未逐依赖核验',
      status:statusFor(name,dependencyEcosystem),
      projects:0,
      ...functionEvidence(name,dependencyEcosystem),
      scenarioAssignment:'unconfirmed'
    };
    item.projects+=1;
    group.set(key,item);
  }
}

const baseScenarioMeta=[];
const scenarioCounters={};
for(const row of scenarioData.rows){
  const domain=row[0];
  const id=`S${String(domain).padStart(2,'0')}-${String(scenarioCounters[domain]=(scenarioCounters[domain]||0)+1).padStart(2,'0')}`;
  baseScenarioMeta.push({id,domain,name:row[1]});
}
const extensionScenarioMeta=scenarioData.extensions.map((row,index)=>({id:`X-${String(index+1).padStart(2,'0')}`,domain:'extension',name:row[0],related:String(row[4]).split('/').map(Number)}));
const scenarioMeta=new Map([...baseScenarioMeta,...extensionScenarioMeta].map(item=>[item.id,item]));
const scenarioBuckets=Object.fromEntries([...scenarioMeta.keys()].map(id=>[id,new Map()]));
const libraryKey=item=>`${item.ecosystem}|${item.name}`.toLocaleLowerCase('en-US');
const mergeInto=(bucket,item)=>{
  const key=libraryKey(item),existing=bucket.get(key);
  if(!existing){bucket.set(key,{...item});return;}
  existing.projects+=item.projects;
};

const domains={};
for(const domain of analysis.domains){
  const candidateScenes=baseScenarioMeta;
  const libraries=[...groups[domain.id].values()].map(item=>{
    const text=functionText(item);
    const ranked=candidateScenes.map(scene=>({scene,...scoreRule(text,baseRules.get(scene.id)||[])})).sort((a,b)=>b.score-a.score||a.scene.id.localeCompare(b.scene.id));
    const best=ranked[0];
    const scenarioId=best.score>0?best.scene.id:domainDefaults[domain.id];
    const assigned={...item,scenarioId,scenarioName:scenarioMeta.get(scenarioId).name,
      scenarioAssignment:best.score>0?'function-match':'domain-fallback',
      scenarioAssignmentBasis:best.score>0?`全局功能描述命中：${best.hits.join('、')}`:'官方功能描述未命中场景词；按项目所属能力大类回退，需人工复核',
      scenarioConfidence:best.score>=4?'high':best.score>0?'medium':'low'};
    mergeInto(scenarioBuckets[scenarioId],assigned);
    return assigned;
  }).sort((a,b)=>b.projects-a.projects||a.name.localeCompare(b.name,'en'));
  const counts=libraries.reduce((result,item)=>(result[item.status]=(result[item.status]||0)+1,result),{});
  domains[domain.id]={total:libraries.length,functionAssignedRelations:libraries.filter(item=>item.scenarioAssignment==='function-match').length,fallbackRelations:libraries.filter(item=>item.scenarioAssignment==='domain-fallback').length,counts,libraries};
}

for(const extension of extensionScenarioMeta){
  const terms=extensionRules.get(extension.id)||[];
  for(const domainId of extension.related){
    for(const item of domains[domainId]?.libraries||[]){
      const result=scoreRule(functionText(item),terms);
      if(!result.score)continue;
      mergeInto(scenarioBuckets[extension.id],{...item,scenarioId:extension.id,scenarioName:extension.name,scenarioAssignment:'extension-function-match',scenarioAssignmentBasis:`跨领域功能命中：${result.hits.join('、')}`,scenarioConfidence:result.score>=4?'high':'medium'});
    }
  }
}

const scenarios={};
for(const [id,bucket] of Object.entries(scenarioBuckets)){
  const libraries=[...bucket.values()].sort((a,b)=>b.projects-a.projects||a.name.localeCompare(b.name,'en'));
  const statusCounts=libraries.reduce((result,item)=>(result[item.status]=(result[item.status]||0)+1,result),{});
  const languageCounts=libraries.reduce((result,item)=>(result[item.ecosystem]=(result[item.ecosystem]||0)+1,result),{});
  const assignmentCounts=libraries.reduce((result,item)=>(result[item.scenarioAssignment]=(result[item.scenarioAssignment]||0)+1,result),{});
  scenarios[id]={name:scenarioMeta.get(id).name,total:libraries.length,statusCounts,languageCounts,assignmentCounts,libraries};
}
const allRelations=Object.values(domains).flatMap(domain=>domain.libraries);
const uniqueLibraries=[...new Map(allRelations.map(item=>[libraryKey(item),item])).values()];
const uniqueStatusCounts=uniqueLibraries.reduce((result,item)=>(result[item.status]=(result[item.status]||0)+1,result),{});
const libraries=Object.fromEntries(uniqueLibraries.map(item=>[libraryKey(item),Object.fromEntries(Object.entries(item).filter(([key])=>!['projects','scenarioId','scenarioName','scenarioAssignment','scenarioAssignmentBasis','scenarioConfidence'].includes(key)))]));
for(const scenario of Object.values(scenarios))scenario.libraries=scenario.libraries.map(item=>({key:libraryKey(item),projects:item.projects,scenarioAssignment:item.scenarioAssignment,scenarioAssignmentBasis:item.scenarioAssignmentBasis,scenarioConfidence:item.scenarioConfidence}));
const domainSummaries=Object.fromEntries(Object.entries(domains).map(([id,item])=>[id,Object.fromEntries(Object.entries(item).filter(([key])=>key!=='libraries'))]));
const summary={
  sourceRelations:allRelations.length,
  uniqueLibraries:uniqueLibraries.length,
  functionMatchedRelations:allRelations.filter(item=>item.scenarioAssignment==='function-match').length,
  fallbackRelations:allRelations.filter(item=>item.scenarioAssignment==='domain-fallback').length,
  baseScenarioAssignments:Object.entries(scenarios).filter(([id])=>id.startsWith('S')).reduce((sum,[,item])=>sum+item.total,0),
  extensionAssignments:Object.entries(scenarios).filter(([id])=>id.startsWith('X')).reduce((sum,[,item])=>sum+item.total,0),
  uniqueStatusCounts
};
const payload={
  version:'2.0.0',
  generatedOn:'2026-09-14',
  definition:'当前项目清单中的三方库按官方注册表功能描述在120个基础场景中全局分配；项目所属能力大类只用于无功能命中时的低置信度回退，跨领域场景仅纳入功能词明确命中的库。',
  denominatorDefinition:'场景库数按“来源生态 + 库名”去重；同一库可因服务多个项目能力或跨领域功能出现在多个场景。统计表示功能分配结果，不等同于真机兼容性验证。',
  evidenceLimit:'逐库功能优先使用npm、PyPI、Homebrew官方注册表描述，其次使用现有Python/C++目录说明。功能词命中记为“功能匹配”；没有命中细分词的库按项目所属大类回退到通用场景并标记“需复核”。当前仅Python目录按逐库名称匹配标记完成，Node.js与C/C++统一标记进行中，Go/Java/Rust为数据缺失。',
  registryMetadata:{updatedAt:registryMetadata.updatedAt||null,requested:registryMetadata.requested||0,resolved:registryMetadata.resolved||0,missingDescription:registryMetadata.missingDescription||0,notFound:registryMetadata.notFound||0,failed:registryMetadata.failed||0},
  assignmentDefinition:{'function-match':'官方/目录功能描述命中具体场景词','domain-fallback':'未命中细分功能词，按项目所属大类回退，需复核','extension-function-match':'功能描述命中跨领域场景词'},
  statusDefinition:{completed:'已进入当前Python鸿蒙完成目录','in-progress':'Node.js或C/C++正在进行鸿蒙化，逐库结果待回填',gap:'Python需求库未在当前完成目录检出','data-missing':'该生态适配目录数据缺失'},
  summary,
  libraries,
  domains:domainSummaries,
  scenarios
};
await fs.writeFile(path.join(root,'scenarios-v1-library-candidates.js'),`/* Generated by outputs/taxonomy-validation-20260912/build_scenario_candidates.mjs. */\nwindow.SCENARIO_V1_LIBRARY_CANDIDATES = ${JSON.stringify(payload)};\n`);
console.log(JSON.stringify(Object.fromEntries(Object.entries(domains).map(([id,value])=>[id,{total:value.total,counts:value.counts}]))));
