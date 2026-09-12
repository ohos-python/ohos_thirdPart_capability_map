import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const out=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(out,'../..');
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const readJS=async f=>{let s=await fs.readFile(f,'utf8');return JSON.parse(s.slice(s.indexOf('=')+1).trim().replace(/;$/,''));};
export const domains=[
 [1,'基础编程与通用工具','通用算法、配置、校验、序列化、基础日志','各主流语言','日志生成属本类；日志汇聚监控属15类','补充统一包名、版本、许可和平台信息'],
 [2,'系统资源与原生互操作','文件、压缩、进程、线程、FFI、运行时、设备接口','C/C++、Rust、Go','运行时是能力提供方类型，不应当作普通应用库','补充驱动、嵌入式及设备访问标签'],
 [3,'网络与通信协议','网络客户端、协议栈、RPC、代理、传输','C/C++、Go、Java、JS/TS','HTTP客户端归3；Web业务框架归6','补充蓝牙、工业协议与实时通信标签'],
 [4,'安全与身份认证','密码、TLS、身份、权限、密钥、漏洞检测','C/C++、Rust、Java、C#、Go','安全是主能力，也可作为所有类别的横向要求','补充隐私、供应链安全、许可合规标签'],
 [5,'数据库、存储与检索','数据库引擎、驱动、ORM、缓存、全文和向量检索','SQL、C/C++、Java、Rust','数据库客户端界面仍归5；通用UI框架归7','区分引擎、SDK和数据库服务'],
 [6,'后端服务与业务流程','Web后端、CMS、业务规则、任务、确定性工作流','Java、C#、JS/TS、Go、Python、PHP','确定性任务编排归6；模型决策循环归13','补充交易、消息、工作流及行业业务标签'],
 [7,'用户界面与交互','Web、GUI、CLI/TUI框架、跨端交互','JS/TS、C++、C#、Dart、Kotlin、Swift','仅使用Electron/Qt/TUI不代表主能力属于7','把展现形态与功能类别拆开'],
 [8,'数据处理与科学计算','ETL、统计、数值计算、数据分析、科学可视化','Python、SQL、R、C/C++、Fortran','模型训练归11；一般数据分析归8','补充GIS、仿真、优化与领域数据标签'],
 [9,'图形、多媒体与实时应用','图像、音视频、2D/3D、游戏、媒体编辑','C/C++、C#、JS/TS','模型驱动识别归11；媒体编解码与引擎归9','补充CAD/CAE、游戏、实时和硬件加速标签'],
 [10,'文档与办公数据处理','Word、Excel、PPT、PDF读写、转换、排版','Python、JS/TS、Java、C#','直接改文件归10；操控正在运行的应用归12','补充复杂版式保真、公式重算与签章验证'],
 [11,'AI模型与机器学习','模型训练、推理、接入、OCR、语音与多模态','Python、C/C++','模型能力归11；工具执行与任务规划归13','分别标记模型、框架、服务SDK和推理引擎'],
 [12,'办公软件与桌面操作自动化','应用接口、浏览器、GUI操作、跨应用流程、结果验证','Python、JS/TS、Java、C#','浏览器执行器归12；测试主用途可归14并挂12标签','补充可访问性、截图、输入、权限、人工确认接口'],
 [13,'Agent编排与工具执行','规划、模型决策循环、工具调用、记忆、MCP、恢复','Python、JS/TS、Java、C#','技能文档不是Agent运行时；办公执行器归12','区分可执行框架、Agent应用、技能资源和协议'],
 [14,'软件构建、开发与测试','编译器、包管理、IDE、构建、测试、代码分析','随业务语言；Rust、Go、C++、Python、TS','编程Agent主任务是软件开发时归14并挂13标签','补充需求、架构、质量、配置与供应链管理标签'],
 [15,'部署运维与可观测性','部署、容器、运维、日志汇聚、指标、追踪、告警','Go、Python、Shell及各业务语言','应用业务监控不一定是系统可观测性；按对象区分','补充备份恢复、可靠性、发布与运维安全标签'],
].map(([id,name,scope,languages,boundary,action])=>({id,name,scope,languages,boundary,action}));
const exact=new Map();
function add(cat,names,tags=''){for(let n of names.split('|'))exact.set(n.toLowerCase(),{cat,tags});}
add(1,'loguru|spdlog|hutool|gson|simdjson|jq|libqalculate (qalc)|it-tools|jsoncrack.com');
add(2,'node|bun|deno|linux|7-zip|container|graal|python|java|zoxide|mc (midnight commander)|nnn|ncdu|mg|wsabuilds|docker-osx|macos|winutil|win11debloat|omarchy|hyprland|mole|thefuck|librepods|powertoys','原生/系统接口');
add(3,'curl|axios|v2rayng|v2rayn|sing-box|headscale|caddy|traefik|wg-easy|localsend|magic-wormhole|sniffnet|github520|new-pac|zapret-discord-youtube|mihomo-party|clash-verge-rev|biglybt|qbittorrent|proxyee-down|ntfy|uBlock','网络通信');
add(4,'openssl|keycloak|authentik|better-auth|vaultwarden|infisical|trivy|safeline|gitleaks|trufflehog|hackingtool|strix|pentagi|shannon','安全审计');
add(5,'supabase|sqlitebrowser|dbeaver|elasticsearch|mycli|chartdb|chat2db|minio|neon|rustfs|3fs|zvec|dice|qmd|pageindex','数据服务');
add(6,'spring-boot|fastapi|django|hono|gin|appwrite|pocketbase|payload|ghost|halo|nodebb|rocket.chat|reaction|evershop|saleor|django-oscar|mall|mall-swarm|litemall|vhr|pig|jeecgboot|ruoyi-cloud|ruoyi-vue-pro|eladmin|spring-boot-demo|spring-boot-online-exam|spring-cloud-alibaba|xxl-job|conductor|kestra|seata|incubator-seata|nettychat|formbricks|tooljet|nocobase|nocodb|plane|hrms|fizzy|social-app|lenster|outline|wiki.js|pandaWiki|f/prompts.chat|freecodecamp|n8n|activepieces|windmill|eFAK (kafka eagle)|rocketmq-dashboard','业务应用/确定性工作流');
add(7,'react|react-native|vue|core/vue|bootstrap|ui|vue-element-admin|electron|flutter|dioxus|clay|expo|xyflow|next.js|gradio|taipy','UI框架');
add(8,'pandas|polars|pygwalker|fg-data-profiling|cudf|scilab|akshare|yfinance|openbb|openbbterminal|finceptterminal|freqtrade|nautilus_trader|pathway|dataease|marimo|bigdata_analyse|datahub-flink-clickhouse|city-roads|worldmonitor','数据/行业分析');
add(9,'ffmpeg|sfml|pygame|godot|three.js|cocos-engine|engine|manim|anime|graphite|excalidraw|drawnix|tldraw|penpot|audacity|gimp|inkscape|krita|imagej|flameshot|handbrake|obs studio|openshot|opencut|vlc|jellyfin|freetube|spotube|kazumi|musicfree|youtube-music|yt-dlp|youtube-dl|sunshine|moneyprinterturbo|pixelle-video|videolingo|animateddrawings|remotion|gifsicle|cava|cmus|ncmpcpp|supertuxkart|cnc_remastered_collection|yuzu|shadps4|openscreen|biliMusic|echo|bilibili-electron-harmonyos|bilibili-electron-harmony-os|ohos_lxmusic（落雪音乐鸿蒙版）|ohos_imv_electron|ohos_shotwell_electron|yesplaymusic-ohos|cat-catch','媒体/图形');
add(10,'python-docx|markitdown|docling|mineru|marker|pdfmathtranslate|opendataloader|opendataloader-pdf|pdf-inspector|stirling-pdf|ocrmypdf|convertx|calibre|jabref|freeplane|koreader|rendercv|paperless-ngx|paperless|notepadnext|note-gen|siyuan|memos|affine|open-notebook|omnivore|hoarder|ohos_xhbj（xh 笔记）|ohos_freeplane_electron|ohos_logseq|ohos_marktext|ohos_xournal_electron|omniparse|ppt-master|open-design','文档/知识内容');
add(11,'tensorflow|pytorch|transformers|stable-diffusion-webui|comfyui|deepface|paddleocr|umi-ocr|whisper|bitnet|llama.cpp|ollama|localai|nano-vllm|sglang|qwen2.5|grok-1|flux|cogvideo|open-sora|voxcpm|vibevoice|chatterbox|voicebox|handy|supervision|ultralytics|deepep|deepgemm|flashmla|verl|heretic|timesfm|kronos|litellm|one-api|omniroute|9router|sub2api|exo|ruview|wifi-densepose|wav2lip|ray','AI模型/推理');
add(12,'playwright|pyautogui|browser-use|skyvern|ui-tars-desktop|helium|easyspider|scrapy|scrapling|mediacrawler|crawl4ai|firecrawl|douBanspider|sinaspider|zhihu_spider|findtrip|webmagic|gecco|nutch|webagent|cloakbrowser|officecli|openhuman|archivebox|rustdesk|scrcpy|gkd|ecopaste','办公/浏览器执行');
add(13,'langchain|langgraph|langflow|dify|flowise|autogen|crewai|metagpt|agent-zero|generative_agents|tradingagents|vibe-trading|ai-hedge-fund|ai-berkshire|dexter|bettafish|mirofish|mirothinker|storm|deeptutor|ragflow|lightrag|memgpt|letta|memori|memu|headroom|graphiti|agentmemory|claude-mem|semantica|surfsense|khoj|anything-llm|embedchain|nanobot|hermes-agent|openclaw|autogpt|eigent|aionui|lobe-chat|chatgpt-on-wechat|qchatgpt|airi|call-center-ai|open-webui|ollama-webui|jan|sim|claude-flow|genai-toolbox|agent-reach|deepseek-harness|tencentdb-agent-memory','Agent/模型与工具');
add(14,'llvm-project|typescript|babel|v|marked|go|rust|vscode|ruff|oxc|uv|esbuild|neovim|spyder|lazygit|tig|delta|jj|hurl|httprunner|seleniumbase|airtest|spring-boot-testing|hoppscotch|bruno|vuepress|arkdecompiler|repomix|understand-anything|codegraph|codebase-memory-mcp|graphify|spec-kit|vibe-kanban|daytona|cc-switch|void|opencode|codex|claude-code|cline|kilocode|crush|pi-mono|oh-my-opencode|oh-my-claudecode|oh-my-codex|prime-agent|avante.nvim|aider|vscode-copilot-chat|gemini-cli|dyad|screenshot-to-code|ai-website-cloner-template|orca|multica|free-claude-code|cursor-free-vip|rtk','软件工程；编程Agent需额外挂13标签');
add(15,'kubernetes|prometheus|grafana|signoz|posthog|uptime-kuma|ansible|jenkins|coolify|1panel|collectd|htop|fastfetch|nightingale|localstack|ansible-for-devops|ansible-kubernetes|k8s-terraform-ansible-sample|xpipe','运维/可观测性');
add(2,'ohmyzsh|termux-app','终端/系统交互');
add(4,'sherlock|maigret','公开信息检索/安全调查');
add(5,'ohos_chiner|mindsdb','数据管理/数据库工具');
add(6,'chatterino2|full-stack-fastapi-template','业务应用');
add(7,'htmx|pake','交互/跨端框架');
add(8,'wrenai|trendradar','数据分析/信息聚合');
add(9,'immich|tachidesk|diagrams|next-ai-draw-io','媒体/图形应用');
add(10,'typst|anydoc','文档解析/排版');
add(11,'omniparser|unlimited-ocr|langextract|amphion|upscayl','模型/OCR/多模态');
add(12,'chrome-devtools-mcp|playwright-mcp','浏览器执行；MCP工具接口');
add(13,'spring-ai-alibaba|goose|deer-flow|archon|prompt-optimizer|modelcontextprotocol/servers','Agent编排/工具服务');
add(14,'sway|grok-build|beads|refined-github','软件工程/开发工具');
const resourceNames=new Set('HelloGitHub|JavaGuide|fucking-algorithm|generative-ai|anthropic-quickstarts|500-AI-Agents-Projects|open-source-games|professional-programming|GPT_API_free|free-llm-api-resources|Free-Certifications|happy-llm|prompt-engineering-for-developers|pure-bash-bible|90DaysOfCyberSecurity|design.md|exercises-dataset|How-To-Secure-A-Linux-Server|toBeBetterJavaer|claude-howto|100-exercises-to-learn-rust|fluentui-system-icons|Self-Hosting-Guide|best-of-ml-python|llm-course|ai-engineering-from-scratch|learn-claude-code|BigData-In-Practice|LeetCodeAnimation'.toLowerCase().split('|'));
const resourcePattern=/(^awesome($|[-_])|^skills$|[-_]skills$|[-_]skill$|handbook|tutorial|beginners|for-beginners|zoomcamp|interview|self-learning|free-programming|hello-algo|hello-agents|javascript-algorithms|python-100-days|30-seconds-of-code|CS-Notes|you-dont-know-js|system-design|programming-books|book-of-secret|the-art-of-command|project-based-learning|^courses$|^cookbook$|^weekly$|^public-apis$|^chinatextbook$|^libpku$|^build-your-own-x$|^devops-exercises$|^ai-agent-book$|^funNLP$|^seclists$|^payloadsallthethings$|^iptv$|dns-blocklists|^gitignore$|^chinese-poetry$|^free-for-dev$|^996.icu$|^freedomain$|^thealgorithms\/|best-practice|^n8n-workflows$|^superpowers$|^agency-agents$|^agents.md$|^agents$|^12-factor-agents$|^boilerplates$|^ECC$|^gstack$|^ponytail$|^ai-engineering-hub$|^RAG_Techniques$|^ML-For-Beginners$|^financial-services$)/i;
const sourceRows=await read(path.join(out,'local-source.json'));
const current=await readJS(path.join(repo,'third-party-satisfaction-cleaned-v2.js'));
const currentByName=new Map(current.projects.map(p=>[p.project.toLowerCase(),p]));
const ghMap=new Map();
for(let f of (await fs.readdir(out)).filter(f=>/^github-.*\.json$/.test(f))){let d=await read(path.join(out,f));for(let r of d.items||[]){let k=r.full_name.toLowerCase();let old=ghMap.get(k);if(!old)ghMap.set(k,{...r,groups:[],queries:[],fetchAt:d.fetchedAt,starSource:d.url,method:'GitHub REST Search API'});let g=ghMap.get(k);g.groups.push(f.slice(7,-5));g.queries.push(d.query);}}
for(let f of (await fs.readdir(out)).filter(f=>/^extra-.*\.json$/.test(f))){let r=await read(path.join(out,f));if(r.status!==200)continue;let k=r.full_name.toLowerCase();if(ghMap.has(k))continue;ghMap.set(k,{...r,groups:['补充代表项目'],queries:['定向补充；非随机抽样'],fetchAt:r.fetchedAt,starSource:r.html_url,method:r.sourceMethod});}
const normalize=s=>String(s||'').toLowerCase().replace(/^https?:\/\/(www\.)?github.com\//,'').replace(/\.git$/,'').replace(/\/$/,'');
function classify(name,description='',framework='',language=''){
 let full=normalize(name),base=full.split('/').at(-1);let t=full+' '+description;
 if(/arkui/i.test(framework)||language==='ArkTS')return {cat:0,kind:'平台应用/非三方库',basis:'源表标记ArkTS或ArkUI；单列平台范围，不计三方库验证分母',review:'范围排除',tags:'平台依赖'};
 if(resourceNames.has(base)||resourcePattern.test(base)||/^thealgorithms\//i.test(full)||/\/computer-science$/.test(full)||base==='javascript'||base==='developer-roadmap'||base==='chinese-independent-developer'||base==='howtocook'||base==='howtolivelonger'||base==='engineering-blogs'||base==='summer2023-internships'||base==='system-prompts-and-models-of-ai-tools')return {cat:0,kind:'教程/资源/技能资产',basis:'按项目名称与已获取定位识别为知识、数据或技能资源；非独立软件能力证据',review:'范围排除',tags:/skill|agent|superpower|ECC|gstack/i.test(base)?'Agent资源（不等于运行时）':'知识/数据资产'};
 if(['home-assistant/core','huggingface/lerobot','xiaomi/ha_xiaomi_home','unionlabs/union','fuellabs/fuel-core'].includes(full)||base==='octoprint')return {cat:0,kind:'软件项目',basis:'设备控制、机器人或区块链具有独立领域语义，当前15类需跨类组合及行业标签',review:'范围待决',tags:/union|fuel/.test(full)?'区块链/分布式信任':'IoT/机器人/工业控制'};
 let x=exact.get(full)||exact.get(base);
 if(x)return {...x,kind:'软件项目',basis:description?'项目定位与GitHub描述人工对照':'项目名称/框架的明确功能定位；未逐一在线核验README',review:description?'元数据已核验':'本地证据分类'};
 let rules=[[/\b(log library|logging library|serialization)\b/i,1],[/\bGUI automation|browser automation|web crawler|web scraper/i,12],[/\bidentity|authentication|password manager|secret scanning/i,4],[/\bobservability|infrastructure monitoring|deployment platform/i,15],[/\bdataframe|data analysis|statistical/i,8],[/\bcompiler|code editor|coding agent|IDE\b/i,14],[/\bmachine learning|model inference|diffusion model/i,11],[/\bUI components|user interface framework/i,7],[/\bPDF|Word documents|office documents/i,10],[/\bgame engine|multimedia library|audio\/video/i,9],[/\bHTTP client|network protocol/i,3],[/\bdatabase|object storage/i,5],[/\bagent|multi-agent/i,13],[/\bbackend|CMS\b/i,6]];
 for(let [rx,cat]of rules)if(description&&rx.test(description))return {cat,kind:'软件项目',basis:'上游描述规则命中：'+rx.source,review:'规则候选待复核',tags:'跨类边界待复核'};
 return {cat:0,kind:'待确认项目',basis:'缺少明确功能描述，不按依赖或语言强行归类',review:'信息不足',tags:''};
}
const duplicateKeys=new Map();
const locals=sourceRows.map(r=>{
 const key=normalize(r.url||r.project);const gh=ghMap.get(key);const cl=classify(key,gh?.description||'',r.framework||'',r.language||'');
 const old=currentByName.get(r.project.toLowerCase());const dup=duplicateKeys.has(key);if(!dup)duplicateKeys.set(key,r.id);
 return {...r,key,duplicateOf:dup?duplicateKeys.get(key):null,...cl,category:domains.find(d=>d.id===cl.cat)?.name||'未归入15类',oldCategory:old?.projectType||'当前页面未列入',sourceCoverage:old?.coverage??null,sourceMatched:old?.matched??null,cleanDependencies:old?.dependencies??null,githubLanguage:gh?.language||null,eligible:!dup&&!['平台应用/非三方库','教程/资源/技能资产'].includes(cl.kind)?1:0};
});
// Keep local display names for snapshots with non-GitHub URLs and recognizable names.
for(let l of locals)if(l.cat===0&&l.review==='信息不足'){let alt=classify(l.project,'',l.framework||'',l.language||'');if(alt.cat||alt.review!=='信息不足')Object.assign(l,alt,{category:domains.find(d=>d.id===alt.cat)?.name||'未归入15类',eligible:!l.duplicateOf&&!['平台应用/非三方库','教程/资源/技能资产'].includes(alt.kind)?1:0});}
const ghRows=[...ghMap.values()].sort((a,b)=>b.stargazers_count-a.stargazers_count).map(r=>{let cl=classify(r.full_name,r.description||'');let local=locals.filter(l=>l.key===r.full_name.toLowerCase());return {...r,...cl,category:domains.find(d=>d.id===cl.cat)?.name||'未归入15类',localRows:local.map(l=>l.id),eligible:!['平台应用/非三方库','教程/资源/技能资产'].includes(cl.kind)?1:0,licenseLabel:r.license?.spdx_id||'未核验许可'};});
const standards=[
 ['ACM CCS 2012','计算研究与文献主题分类，不是三方库适配认证','官方指导采用多层树，并建议细化主题及选择相关类别','可以参考分层和多标签结构；本表不宣称15类与其逐项等价','https://www.acm.org/binaries/content/assets/publications/article-templates/ccs-howto-v6-12jan2015.pdf'],
 ['SWEBOK V4','软件工程知识体系，不是按三方库功能划分的目录','18个知识域，并涵盖架构、运维、安全等工程实践','14/15/4类与部分工程主题对应；需求、管理、经济等不能声称已完全覆盖','https://www.computer.org/education/bodies-of-knowledge/software-engineering'],
 ['CNCF Landscape','云原生行业技术地图，不是通用编程领域国家/国际标准','数据库、消息、运行时、网络、安全、构建、可观测性等技术分类','有助于校验2/3/4/5/6/14/15类；不能用其验证办公和所有行业应用','https://landscapeapp.cncf.io/cncf/guide'],
];
const issues=[
 ['标准符合性','全部15类','自定义场景分类不等于正式标准认证','ACM是主题分类；SWEBOK是知识体系；CNCF是行业地图','保留15类作为工程分类v1；增加版本、定义、边界与映射依据'],
 ['统计分母','原始601条与当前页面327条','原始表333条有依赖，268条未采集到依赖；清洗后327条进入页面','“无依赖记录”不等于不需要依赖，也不等于不能开发','保留601条审计记录，分别呈现去重、排除、待核验与可归类分母'],
 ['重复项目','同仓库多来源记录','按URL规范化可发现同一仓库重复记录','源表记录数与唯一项目数不同','保留源行；以规范化URL去重，迁移别名未核实前不自动合并'],
 ['旧分类错位','cocos/cocos-engine','原页面归浏览器自动化与数据采集','游戏引擎的主能力应归9；依赖采集工具不能决定项目功能','按主用途归9类；保留开发工具及UI标签'],
 ['旧分类错位','astral-sh/ruff','原页面归行业与其他应用','代码检查/格式化属于14类','纠正项目主分类；源码语言与Python工具目标语言分列'],
 ['旧分类错位','honojs/hono','原页面归开发工具与工程效率','Web框架属于6类','不要依据仓库依赖中的测试工具判断主功能'],
 ['旧分类错位','goauthentik/authentik','原页面归Web与业务服务','身份与访问管理属于4类','Web部署形态不代替安全功能分类'],
 ['旧分类错位','ccfos/nightingale','原页面归数据库、存储与中间件','监控告警属于15类','数据库依赖不是监控系统主分类'],
 ['文档与操作边界','10/12类','读写文件和操作运行中的应用是不同能力','python-docx与PyAutoGUI分别提供文件编辑和GUI操作','分别验证文件格式保真与应用接口/权限/执行结果'],
 ['Agent与执行器边界','12/13/14类','browser-use、Playwright、编程Agent均可能多用途','以主交付目标归一类，附加浏览器执行、Agent、测试标签','Playwright本表按浏览器执行归12，另挂测试14标签'],
 ['业务流程边界','6/12/13类','n8n带AI与自动化标签，但不等于原生桌面控制器','确定性集成工作流主归6；Agent决策和办公执行分别挂13/12标签','不要用automation关键字把Ansible或Home Assistant直接归办公自动化'],
 ['展现形态混用','7类与其他类别','Qt/Electron/TUI只是展现形态','Cocos属于9，数据库客户端属于5，IDE属于14','新增交互形态字段，不将所有桌面软件归7'],
 ['行业范围缺口','IoT/机器人/工业控制','Home Assistant、OctoPrint、lerobot需要设备领域能力','2/3/8/9/11类可组合，但目前缺少显式行业标签与接口验收','补充行业轴；如设备场景成为主目标再讨论独立一级类'],
 ['行业范围缺口','区块链/分布式信任','Union/Fuel等不能仅因security关键词就当作密码库','金融/区块链是行业或技术架构标签，跨4/5/6类','作为范围待决保留，避免强行归类制造100%覆盖'],
 ['工程生命周期缺口','14/15类','目前详细条目偏构建测试运维，需求与架构管理弱','SWEBOK覆盖范围比工具功能目录更宽','补需求、架构、质量、版本配置、许可与安全等横向标签'],
 ['样本偏差','GitHub高星','星数衡量关注，受项目年龄、资源仓库和营销影响','全局Top100与15个关键词Top5及定向补充均为目的性样本','只能报告本样本归类率，不推断行业使用频率和全球覆盖率'],
 ['许可口径','GitHub公开仓库','公开源码或高星不等于OSI开源许可','n8n描述为fair-code；部分仓库许可未识别','保存SPDX原值和待核验状态，不将全部样本称作已审计开源库'],
 ['语言口径','GitHub主语言与源表语言','GitHub单一language字段可能反映代码量、测试或生成代码','LLVM、TypeScript、Python工具的使用语言与实现语言不同','保留原值，另核实API语言和引擎语言；不据此机械判断生态'],
 ['适配证据','当前目录满足度','匹配依赖名称不是安装、核心功能或端到端验证','Electron和Playwright用户确认支持，不自动外推其他绑定或插件','本次只验证分类；沿用v2满足度且明确其定义'],
 ['资源范围','教程/技能/资料仓库','课程、awesome和技能文件不能当作可执行库','全球高星榜中存在大量知识资产','保留记录并排除软件归类率分母；Agent资产可另建资源目录'],
];
const stats={raw:locals.length,unique:duplicateKeys.size,duplicates:locals.filter(l=>l.duplicateOf).length,localEligible:locals.filter(l=>l.eligible).length,localClassified:locals.filter(l=>l.eligible&&l.cat>0).length,localPending:locals.filter(l=>l.eligible&&l.cat===0).length,github:ghRows.length,githubEligible:ghRows.filter(r=>r.eligible).length,githubClassified:ghRows.filter(r=>r.eligible&&r.cat>0).length,githubPending:ghRows.filter(r=>r.eligible&&r.cat===0).length};
const analysis={generatedAt:new Date().toISOString(),domains,locals,github:ghRows,standards,issues,stats};
await fs.writeFile(path.join(out,'analysis.json'),JSON.stringify(analysis,null,2));
console.log(JSON.stringify(stats));
console.log('LOCAL PENDING',locals.filter(l=>l.eligible&&!l.cat).map(l=>l.id+':'+l.project).join('\n'));
console.log('GITHUB PENDING',ghRows.filter(l=>l.eligible&&!l.cat).map(l=>l.full_name).join('\n'));
console.log('CATEGORY COUNTS',domains.map(d=>[d.id,d.name,locals.filter(r=>r.eligible&&r.cat===d.id).length,ghRows.filter(r=>r.eligible&&r.cat===d.id).length]));
