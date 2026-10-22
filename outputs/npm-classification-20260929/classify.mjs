import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
const dir=path.dirname(fileURLToPath(import.meta.url));
async function readSnapshot(name){
 try{return await fs.readFile(path.join(dir,name),'utf8');}
 catch(e){if(e.code!=='ENOENT')throw e;return gunzipSync(await fs.readFile(path.join(dir,name+'.gz'))).toString('utf8');}
}
export const categories=[
 ['foundation','通用编程工具库','日志、配置、解析、序列化、校验、日期、字符串、数据结构及语言兼容工具'],
 ['frontend','前端开发库','Web 框架、UI 组件、DOM、样式和浏览器端交互'],
 ['backend','后端开发库','服务端框架、API、中间件、会话、任务队列和邮件服务'],
 ['agent','Agent/TUI开发库','Agent 编排、MCP、终端界面、交互式命令行和伪终端'],
 ['office','通用办公开发库','浏览器自动化，以及 Word、PPT、Excel、PDF 和办公文档处理'],
 ['database','数据库与存储','数据库驱动、ORM、持久化、缓存及搜索存储'],
 ['network','网络与通信','HTTP 客户端、WebSocket、RPC、协议、消息和实时通信'],
 ['build','构建与工程工具','编译、打包、转换、代码生成、脚手架及包管理'],
 ['testing','测试与质量','测试、断言、Mock、Lint、格式化、覆盖率和性能检测'],
 ['data','数据处理与可视化','统计、数学、数据转换、CSV、图表和可视化'],
 ['ai','AI与机器学习','模型 SDK、推理、机器学习、Embedding、Tokenization'],
 ['multimedia','多媒体与图形','图像、字体、SVG、音视频、Canvas、3D 和渲染'],
 ['security','安全与加密','密码、哈希、签名、加密、权限与安全认证'],
 ['cloud','云服务与DevOps','云平台 SDK、部署、容器、监控和可观测性'],
 ['mobile','跨端与移动开发','移动开发、React Native、Electron 和桌面跨端'],
 ['system','系统与原生能力','原生绑定、文件系统、进程、压缩、硬件和操作系统接口'],
 ['business','业务应用与集成','支付、电商、业务平台、行业服务与区块链集成'],
 ['other','其他/待确认','缺少功能证据或未命中当前规则，保留在总数中']
];
// Specific functional patterns precede general ones. A primary label counts once.
const rules=[
 ['office','浏览器自动化',/\b(puppeteer|playwright|selenium|webdriver|chromedriver|browser automation|headless browser|chrome devtools|devtools protocol)\b/i],
 ['office','Word与演示文稿',/\b(docx|pptx|pptxgenjs|powerpoint|officegen|wordprocessingml|mammoth|word documents?|presentation generator)\b/i],
 ['office','Excel与PDF文档',/\b(exceljs|xlsx|sheetjs|spreadsheet|pdfkit|pdfjs|pdfmake|pdf|epub|office document|document conversion)\b/i],
 ['agent','Agent编排与MCP',/\b(langchain|langgraph|llamaindex|agentic|model context protocol|mcp|ai agents?|agent framework|agent orchestration|crewai|autogen)\b/i],
 ['agent','终端交互与TUI',/\b(opentui|blessed|ink|inquirer|enquirer|prompts|cli-spinners|terminal ui|terminal user interface|pseudo.?terminal|node-pty|bun-pty|tui)\b/i],
 ['testing','代码质量与格式化',/\b(eslint|tslint|oxlint|prettier|stylelint|linting|linter|code formatter|static analysis)\b/i],
 ['testing','测试与性能检测',/\b(jest|vitest|mocha|jasmine|chai|sinon|cypress|testing-library|test runner|unit test|test framework|assertion|mocking|code coverage|istanbul|benchmark|profiler|pprof)\b/i],
 ['build','编译打包与代码生成',/\b(babel|webpack|rollup|vite|esbuild|parcel|tsup|swc|gulp|grunt|postcss|autoprefixer|sass|less|typescript compiler|compiler|bundler|transpiler|build tool|code generator|code generation|minifier)\b/i],
 ['build','脚手架与工程管理',/\b(yeoman|scaffolding|scaffold|project generator|package manager|npm scripts|monorepo|lerna|changesets|release automation|husky|commitlint)\b/i],
 ['database','数据库驱动与ORM',/\b(better-sqlite3|sqlite|sqlite3|postgres|postgresql|mysql|mariadb|mongodb|mongoose|prisma|sequelize|typeorm|knex|drizzle|database|sql query|orm)\b/i],
 ['database','缓存与搜索存储',/\b(redis|ioredis|leveldb|levelup|rocksdb|pouchdb|couchdb|elasticsearch|opensearch|key-value store|vector database)\b/i],
 ['mobile','移动与桌面跨端',/\b(react-native|electron|cordova|capacitor|ionic|nativescript|expo|mobile app|desktop app)\b/i],
 ['security','加密与安全认证',/\b(bcrypt|argon2|jsonwebtoken|jose|passport|oauth|jwt|helmet|csrf|cryptograph\w*|encryption|decryption|authentication|authorization|password hash|digital signature|crypto)\b/i],
 ['ai','模型调用与机器学习',/\b(openai|anthropic|tensorflow|onnx|huggingface|machine learning|deep learning|neural network|llm|large language model|embedding|tokenizer|generative ai|inference engine)\b/i],
 ['cloud','云平台与部署',/\b(aws-sdk|aws|azure|google-cloud|google cloud|firebase|docker|kubernetes|serverless|terraform|cloud service|cloud sdk|deployment)\b/i],
 ['cloud','监控与可观测性',/\b(opentelemetry|prometheus|sentry|datadog|telemetry|observability|distributed tracing|application monitoring)\b/i],
 ['multimedia','图像与图形渲染',/\b(sharp|jimp|canvas|webgl|pixi|three\.js|image processing|image manipulation|image transformations?|image conversion|image resizing|image codec|svg|graphics|font|icon set|icons)\b/i],
 ['multimedia','音视频与多媒体',/\b(ffmpeg|audio|video|multimedia|media player|webrtc|codec)\b/i],
 ['data','数据计算与可视化',/\b(d3|chart|charts|chartjs|echarts|plotly|vega|highcharts|csv|dataframe|statistics|statistical|data visualization|data processing|linear algebra|mathjs|mathematical|mermaid)\b/i],
 ['backend','Web服务与API',/\b(express|fastify|koa|hapi|nestjs|nest framework|http server|web server|server framework|middleware|graphql|apollo-server|trpc|backend)\b/i],
 ['backend','队列调度与服务组件',/\b(bullmq|job queue|task queue|cron|scheduler|nodemailer|smtp|session management|rate limiter)\b/i],
 ['frontend','Web框架与UI',/\b(react|vue|angular|svelte|jquery|nextjs|nuxt|astro|preact|tailwind|bootstrap|frontend|front-end|css|dom|ui toolkit|web component|ui component|html templating)\b/i],
 ['network','网络客户端与通信协议',/\b(axios|http client|https?|websocket|socket|mqtt|grpc|dns|proxy|network|undici|tcp|udp|amqp|fetch|protobuf|rpc|webhook|rss|atom feed)\b/i],
 ['system','原生绑定与系统接口',/\b(node-gyp|node-addon-api|napi|native addon|native binding|ffi|filesystem|file system|child process|serialport|usb|worker thread|operating system|system information|openharmony-arm64)\b/i],
 ['system','文件压缩与进程',/\b(compression|decompression|archiver|zip archive|pako|fflate|chokidar|file watcher|file copy|copy files?|recursive copy|file copying|process management)\b/i],
 ['business','业务平台与行业集成',/\b(stripe|paypal|payment|commerce|shopify|salesforce|slack|discord|telegram|wechat|blockchain|ethereum|web3|bitcoin|crm|cms|finance|healthcare|medical)\b/i],
 ['foundation','日志配置与通用工具',/\b(lodash|underscore|ramda|core-js|tslib|zod|yup|ajv|joi|winston|pino|log4js|debug|chalk|semver|uuid|nanoid|dayjs|moment|date-fns|yargs|commander|minimist|glob|minimatch|picomatch|fs-extra|graceful-fs|buffer|stream|events|async|promise|json|yaml|xml|toml|utility|utilities|polyfill|parser|serialize|serialization|validation|string|array|encoding|regular expression|logging|logger|date|time|configuration|data structures|type definitions)\b/i]
];
const overrides=new Map([
 ...['lru-cache','iconv-lite','picocolors','pretty-format','deepmerge','pump','shell-quote','sisteransi','p-limit','p-queue','p-retry','semver','commander','yargs'].map(n=>[n,'foundation']),
 ...['source-map','source-map-js','source-map-support','ignore','typescript','lightningcss','@tailwindcss/oxide'].map(n=>[n,'build']),
 ...['electron','@electron/rebuild'].map(n=>[n,'mobile']),
 ...['form-data','mime','mime-types','mime-db','ipaddr.js','got','request','ws','https-proxy-agent','http-proxy-agent','agent-base'].map(n=>[n,'network']),
 ['sharp','multimedia'],['three','multimedia'],['next','frontend'],['lit','frontend'],['ink','agent'],['ora','agent'],['pg','database'],['axe-core','testing']
]);
const familyRules=[
 ['office','办公文档与浏览器工具',/(?:^@(?:puppeteer|playwright|sheetjs|citation-js)\/|^(?:docxtemplater|pptxgen|excel|pdf-|pdfjs|pdfmake|libreoffice|mammoth|jsreport|mermaid-cli))/i],
 ['agent','Agent与终端工具生态',/(?:^@(?:a2a-js|ag-ui|ai-sdk|opentui|langchain|langgraph|mastra|modelcontextprotocol|ui-tars|anthropic-ai)\/|^(?:opencode|claude-code|codex|opentui|blessed|terminal-kit|boxen|figlet)(?:-|$))/i],
 ['testing','测试与代码质量工具生态',/(?:^@(?:eslint|eslint-community|vitest|jest|testing-library|hint|stryker-mutator)\/|^(?:test-|testing-|assert-|mock-|remark-lint|retext-|eslint-|jshint|lint-|tslint|nyc|tap-|ava$|qunit|uvu$))/i],
 ['build','工程构建与开发工具生态',/(?:^@(?:11ty|babel|swc|rollup|vitejs|pnpm|yarnpkg|npmcli|lerna|nx|nrwl|rspack|rslib|rsbuild|rspress|oclif|stricli|verdaccio|theia|vscode|codingame|volar|ts-morph|microsoft\/api|unrs)\/|^(?:broccoli|semantic-release|unplugin|unbuild|unimport|ts-node|ts-morph|tsconfig|jscodeshift|recast|monaco|vscode|changelog|generate-|create-|cli-|gulp-|grunt-|commitizen|documentation|typedoc|dependency-|resolve-|import-|require-|module-|cjs-|esm-))/i],
 ['mobile','移动与桌面跨端生态',/(?:^@(?:electron|capacitor|ionic|nativescript|expo|react-native|react-native-community)\/|^(?:electron-|react-native-|cordova-|capacitor-))/i],
 ['frontend','Web界面与站点生态',/(?:^@(?:ant-design|antv|mui|material|radix-ui|headlessui|chakra-ui|fluentui|blueprintjs|instructure|tamagui|formkit|formily|floating-ui|tanstack|dnd-kit|docusaurus|mdx-js|pandacss|emotion|styled-system|solidjs|sveltejs|svelte|storybook|ag-grid-community|ag-grid-enterprise|shoelace-style|lwrjs|modern-js|vueuse|nuxt|next|angular|aurelia|contentful|adminjs)\/|^(?:react|vue|angular|ngx-|ng-|svelte|sveltekit|ember-|aurelia-|lit-|lit$|html-|posthtml|css|style-|styled-|jotai|zustand|redux|mobx|storybook|tailwind|bootstrap|bulma|uikit|quasar|element-ui|antd|ant-design|hexo|gatsby|hugo|nunjucks|pug|handlebars|ejs$|liquid-|alpinejs|mithril|backbone|knockout|stimulus))/i],
 ['database','数据库与持久化生态',/(?:^@(?:prisma|drizzle-team|mikro-orm|sequelize|libsql|electric-sql|elastic|opensearch-project|supabase|pglite)\/|^(?:level-|level$|sql-|sql.js|sqlstring|pg-|pg$|mongodb-|redis-|ioredis|lmdb|nedb|keyv|lowdb|lokijs|memcached|db-|kysely))/i],
 ['backend','服务框架与服务端组件',/(?:^@(?:adonisjs|nestjs|hapi|fastify|elysiajs|feathersjs|loopback|adonis|trpc|hono|strapi|medusajs)\/|^(?:hono|elysia|adonis|restify|sails|loopback|meteor|seneca|connect-|serve-|send$|body-parser|cookie-|session-|bull-|bull$|cron-|agenda|mail-|email-|nodemailer))/i],
 ['cloud','云平台与持续交付生态',/(?:^@(?:actions|aws-sdk|aws-cdk|smithy|azure|google-cloud|pulumi|netlify|vercel|cloudflare|opentelemetry|sentry|datadog)\/|^(?:aws-|cdk-|azure-|firebase-|netlify|vercel|wrangler|serverless-|raven$|newrelic|pm2|forever|deploy-|release-it))/i],
 ['ai','机器学习与语言处理生态',/(?:^@(?:huggingface|tensorflow|xenova|nlpjs|agnai|mlc-ai|11labs|elevenlabs)\/|^(?:onnx|transformers|tokenizers|tiktoken|gpt-|sentencepiece|natural$|compromise|wink-|ml-))/i],
 ['data','数学统计与数据分析工具',/(?:^@(?:stdlib|turf|rdfjs|jupyterlab|observablehq|vega|plotly|duckdb)\/|^(?:d3-|math-|mathjs|ml-|statistics|stats-|ndarray|gl-matrix|gl-vec|gl-mat|numjs|bn.js|big.js|bignumber|decimal.js|fraction.js|geojson|geobuf|geodesy|proj4|graphviz|parquet|apache-arrow|data-forge|arquero|danfo))/i],
 ['multimedia','图形音视频与资源工具',/(?:^@(?:mdi|iconify|fortawesome|remotion|resvg|napi-rs\/canvas|pixi|pixi-js|babylonjs)\/|^(?:sharp|resvg|image-|png|jpeg|jpg|gif|bmp|ico-|icon-|svg|svgo|font-|opentype|freetype|color-|colour|rgb|hsl|three-|gl-|regl|pixi|babylon|howler|tone$|lame|mp3|mp4|wav-|webp))/i],
 ['security','安全凭据与密码工具',/(?:^@(?:1password|noble|stablelib|peculiar|simplewebauthn|auth0|okta|panva)\/|^(?:crypto-|md5|sha1|sha256|sha512|hash.js|hash-wasm|hmac|scrypt|pbkdf|bcrypt|argon2|tweetnacl|node-forge|pkcs|x509|jsonwebtoken|jwt-|oauth|openid|auth0|keychain|keytar|secret-|password-))/i],
 ['network','通信协议与网络工具',/(?:^@(?:bufbuild|connectrpc|grpc|libp2p|multiformats|ldapjs)\/|^(?:http-|https-|net-|tcp-|udp-|dns-|ip-|ipaddr|url-|uri-|socket|websocket|ws-|mqtt|amqp|stomp|coap|upnp|nat-|ssdp|socks|proxy-|fetch-|request-|superagent|supertest|axios|undici|node-fetch|cross-fetch))/i],
 ['system','文件系统压缩与原生工具',/(?:^@(?:napi-rs|node-rs|emnapi|isaacs\/fs-minipass)\/|^(?:node-gyp|node-pre-gyp|prebuild|bindings$|nan$|napi-|native-|fs-|file-|files-|path-|mkdir|rimraf|rmdir|chmod|chown|fsevents|watch-|chokidar|spawn-|exec-|execa|cross-spawn|pid-|process-|os-|tar-|tar$|zip-|jszip|gzip|zlib|brotli|lz4|lzma|zstd|compress|decompress|7zip|unzip|unrar|archiver))/i],
 ['business','业务平台与区块链生态',/(?:^@(?:0xsequence|aa-sdk|account-kit|agoric|adyen|solana|metaplex-foundation|walletconnect|gnosis.pm|wormhole-foundation|truffle|ethersproject|polkadot|nomicfoundation|shopify|slack|discordjs|activepieces|prismatic-io|salesforce)\/|^(?:ethers|viem|wagmi|web3|bitcoin|ethereum|solana|truffle|hardhat|stripe|paypal|shopify|wechat|weixin|wx-|wecom|liff|line-bot|telegram|discord|slack|twilio|braintree|adyen|alipay|analytics-|segment-|cms-|crm-))/i],
 ['foundation','通用工具与语言支持',/(?:^@(?:arr|aashutoshrathi|abraham|aelesia|bconnorwhite|sindresorhus|ungap|es-shims)\/|(?:^|[-/])(util|utils|helper|helpers|config|env|types|type|parse|parser|serialize|format|escape|unescape|encode|decode|base64|unicode|regexp|regex|regexpp|is|has|to|from|get|set|map|reduce|filter|find|sort|unique|deep|clone|merge|equal|equals|every|some|object|array|string|number|float|integer|int|boolean|bool|date|time|timezone|duration|iterator|iterable|iterators|async|promise|defer|debounce|throttle|memoize|cache|weakmap|weakset|setimmediate|log|logger|logging|debug|assert|invariant|error|errors|exception|exceptions|reflect|reflection|metadata|symbols|symbol|polyfill|shim|buffer|bytes|binary|stream|event|events|emitter|i18n|locale|locales|intl)(?:[-/]|$))/i]
];
const supplementalRules=[
 ['office','浏览器与办公协作工具',/\b(webdriverio|wdio|browserstack|saucelabs|quip|collaborative documents?|word files?|excel|powerpoint|presentations?|spread.?sheets?)\b/i],
 ['frontend','页面交互与编辑组件',/\b(ui|uiw|leafygreen|leafygreen-ui|lumino|phosphor|html|html5|styles?|stylesheet|themes?|layout|design system|design tokens|widgets?|buttons?|menus?|tooltips?|popovers?|dropdown|drag.?and.?drop|dragdrop|modal|dialog|scrolling|scrollbar|carousels?|sliders?|datepicker|rich.?text|text editor|code editor|prosemirror|tiptap|codemirror|monaco|highlight.js|highlighting|prismjs|hotwired|turbo|single-page|responsive|forms?|keyboard shortcuts|clipboard|virtual dom|web application|web app|static site generator)\b/i],
 ['backend','API与服务端组件',/\b(openapi|swagger|restful|rest api|api server|routing|router|routes|sessions?|cookies?|mail|email|e-mail|jobs?|task scheduling|dependency injection|inversion of control|ioc container)\b/i],
 ['build','工程命令与源码工具',/\b(cli|command.?line|scaffolding|scaffolds?|codegen|code generation|changelog|semantic-release|statoscope|backstage|source code|syntax tree|abstract syntax|ast|commonjs|modules?|es modules?|module loader|imports?|importing|dependency tree|package dependencies|release|workspaces?|minify|uglify|terser|acorn|espree|recast|git hooks|gitignore|eslint|eslintplugin|tsconfig)\b/i],
 ['testing','断言Mock与诊断',/\b(tests?|testing|assert|assertions?|mocks?|mockserver|mocking|fake timers|fixtures?|mswjs|snapshots?|testable|tap|ava|jasmine|sinon|profiling|profiler|performance testing|benchmarking)\b/i],
 ['network','网络消息与地址处理',/\b(networking|protocol|url|uri|requests?|responses?|eventsource|server-sent|sse|connection|connections|ip address|ip addresses|upnp|nat|ssdp|ftp|sftp|ssh|telnet|ping|opcua|ldap|imap|pop3|socketio)\b/i],
 ['security','凭据签名与安全',/\b(credentials?|key signing|signing|verification|fingerprinting|fingerprintjs|security|hashing|hash|sha|md5|asn1|pki|certificate|certificates|permission|permissions|secrets?|keygrip|csp|xss|sanitize|sanitization)\b/i],
 ['data','数学地理与结构化数据',/\b(math|mathematics|numbers|arithmetic|complex numbers|numerical|matrix|matrices|vectors?|geometry|geometrical|geospatial|geographic|geography|geojson|polygons?|latitude|longitude|coordinates|spatial|graphs?|plot|plots|visualisation|visualization|statistic|probability|regression|distribution|histogram|datasets?|tabular|data conversion|data transformation|rdf|sparql)\b/i],
 ['multimedia','图像音视频资源',/\b(images?|png|jpeg|jpg|webp|gif|bmp|tiff|icons?|fonts?|typeface|typography|colors?|colours?|rgb|hsl|gradient|drawing|rendering|renderers?|shaders?|opengl|gltf|3d|2d|animation|animations|sound|sounds|music|midi|mp3|mp4|wav|ffmpeg|speech|elevenlabs)\b/i],
 ['system','文件进程与本地能力',/\b(files?|directories|directory|folders?|folder|filepaths?|filename|filenames|pathname|paths?|processes|subprocess|spawning|spawn|exec|execute|command execution|environment variables|home directory|temp directory|temporary|operating system|native|addon|add-on|bindings?|wasm|webassembly|prebuild|binary distribution|symlinks?|hardlinks?|permissions|archive|archives|zip|gzip|gunzip|tar|zlib|compression|decompress|inflate|deflate|crc)\b/i],
 ['mobile','移动与桌面系统集成',/\b(android|ios|iphone|ipad|adbkit|adb|todesktop|desktop|mobile|phonegap)\b/i],
 ['database','持久化与数据存储',/\b(storage|persistent|persistence|indexeddb|localstorage|db|key value|key-value|datastore|cockroachdb|cockroachlabs|pgtyped|search index|search engine|ipld|ipfs)\b/i],
 ['business','业务平台与行业工具',/\b(smart contracts?|solidity|cryptoeconomy|cryptocurrency|wallets?|payments?|checkout|commerce|subscription|billing|invoicing|accounting|marketing|customer|customers|segmentation|feature flags?|feature toggles?|devcycle|analytics|tracking|trackers?|geolocation|maps|mapbox|maplibre|leaflet)\b/i],
 ['foundation','数据结构解析与通用工具',/\b(utils?|helpers?|common tools|functions?|functional|objects?|properties|keys?|values?|arrays?|strings?|casing|case conversion|characters?|text|words?|wrap words|padding|truncate|truncation|trim|split|join|replace|substring|comparison|compare|equality|copy|copies|cloning|merge|merging|defaults|options?|configuration|config|configurations|environment|formats?|formatting|parsing|parse|serializer|serializers|serializing|deserializer|decode|encode|encodings?|decode|encoded|decoded|buffers?|bytes?|byte|bits?|base64|base32|hex|hexadecimal|multibase|language|languages|localization|internationalization|translations?|i18next|unicode|profanity|filter|filters|log|logs|logging|errors?|exceptions?|retry|retries|iteration|iterate|iterators?|iterable|iterables|collections?|queues?|stacks?|lists?|linked list|weakmap|weakset|sets?|maps?|throttle|debounce|memoization|memoize|cache|caching|reflect|reflection|metadata|symbols?|typeof|instanceof|type checking|validation|validator|validating|deterministic|random|unique|uuid|shortid|timeout|timer|timers|duration|dates?|time|timezone|timestamps?|setimmediate|promises?|asynchronous|synchronous|concurrent|concurrency|streams?|events?|emitter|callback|callbacks|deferred|checksum|polyfills?|shims?)\b/i]
];
function classify(name,description,keywords){
 description=description.replace(/https?:\/\/\S+/g,' ');
 const n=name.toLowerCase();const text=description+' '+keywords.join(' ');
 const matches=rules.filter(r=>r[2].test(n)||r[2].test(text));
 let primary=rules.find(r=>r[2].test(n))||rules.find(r=>r[2].test(text))||familyRules.find(r=>r[2].test(n))||supplementalRules.find(r=>r[2].test(n)||r[2].test(text));
 let state=primary?(primary[2].test(description)?'描述规则分类':primary[2].test(keywords.join(' '))?'关键词规则分类':'包名推断'):'待确认';
 if(n.startsWith('@types/')){primary=['foundation','TypeScript类型声明',/^@types\//];state='包名推断';}
 if(overrides.has(n)){const id=overrides.get(n);primary=rules.find(r=>r[0]===id);state='重点包功能规则';}
 const id=primary?.[0]||'other';
 const matched=primary?[n.match(primary[2])?.[0],description.match(primary[2])?.[0],keywords.join(' ').match(primary[2])?.[0]].filter(Boolean).join('；'):'';
 return {categoryId:id,label:categories.find(c=>c[0]===id)[1],subcategory:primary?.[1]||'用途待补充',state,
  additional:[...new Set(matches.map(r=>r[0]).filter(v=>v!==id))].map(v=>categories.find(c=>c[0]===v)[1]).join('；'),
  basis:overrides.has(n)?'重点包主功能映射':primary?`规则命中：${matched||primary[1]}`:'未取得足够功能证据或未命中规则'};
}
const source=JSON.parse(await readSnapshot('source-records.json'));
const metadata=new Map((await readSnapshot('npm-metadata.jsonl')).trim().split('\n').filter(Boolean).map(s=>{const v=JSON.parse(s);return [v.name,v];}));
const cached=JSON.parse(await readSnapshot('registry-metadata.json'));
for(const m of Object.values(cached.packages).filter(r=>r.ecosystem==='JavaScript/TypeScript'&&r.httpStatus===200)){
 if(!metadata.get(m.name)?.description)metadata.set(m.name,{...m,status:200,url:m.fetchUrl,fetchedAt:cached.updatedAt,cache:true});
}
try{for(const line of (await readSnapshot('npms-metadata.jsonl')).trim().split('\n').filter(Boolean)){const m=JSON.parse(line);if(m.description&&!metadata.get(m.name)?.description)metadata.set(m.name,m);}}catch(e){if(e.code!=='ENOENT')throw e;}
const grouped=new Map();
for(const p of source.records){const name=p.original_name||p.name;if(!grouped.has(name))grouped.set(name,[]);grouped.get(name).push(p);}
const rows=[...grouped].map(([name,records])=>{
 const m=metadata.get(name)||{};const compatible=records.filter(p=>p.repo==='ohos-compatible-packages'),ports=records.filter(p=>p.repo==='ohos-ports');
 const repoDescription=ports.map(p=>p.description).find(Boolean)||'';
 const description=m.mirror?(repoDescription||m.description):(m.description||repoDescription);
 const keywords=m.keywords||[];const c=classify(name,description,keywords);
 if(m.mirror&&!repoDescription&&c.state==='描述规则分类')c.state='历史描述规则分类';
 return {name,...c,description,keywords:keywords.join('；'),compatible:compatible.length>0,port:ports.length>0,
  compatibleVersions:[...new Set(compatible.map(p=>p.version))].join('；'),publishedNames:ports.map(p=>p.name).join('；'),stable:ports.map(p=>p.stable_version).filter(Boolean).join('；'),beta:ports.map(p=>p.beta_version).filter(Boolean).join('；'),
  deprecated:ports.some(p=>p.deprecated)?'移植包已弃用':m.deprecated?'上游已弃用':'源数据未标记弃用',
  deprecationReason:ports.filter(p=>p.deprecated).map(p=>p.deprecated_message).filter(Boolean).join('；')||m.deprecated||'',
  metadataStatus:m.status===200?(m.description?(m.mirror?'npms历史元数据':m.cache?'既有npm描述快照':'已取得npm描述'):'npm未提供描述'):`${repoDescription?'采用移植仓库描述；':''}npm${m.status==='retry-exhausted'?'限流':m.status||'未补查（限流后停止）'}`,
  descriptionSource:m.mirror&&repoDescription?ports[0].sourceUrl:m.description?m.url:repoDescription?ports[0].sourceUrl:'无',metadataVersion:m.version||'',metadataAt:m.snapshotAt||m.fetchedAt||'',
  sourceUrls:[...new Set(records.map(p=>p.sourceUrl))].join('\n'),npmUrl:'https://www.npmjs.com/package/'+name,repoDescription,
  mappingNote:ports.length>1?'同一上游映射对应多个发布包，需核对原始记录':'单一映射或兼容清单'};
}).sort((a,b)=>categories.findIndex(c=>c[0]===a.categoryId)-categories.findIndex(c=>c[0]===b.categoryId)||a.name.localeCompare(b.name));
const stats={raw:source.records.length,unique:rows.length,compatible:rows.filter(r=>r.compatible).length,ports:rows.filter(r=>r.port).length,overlap:rows.filter(r=>r.compatible&&r.port).length,withDescription:rows.filter(r=>r.description).length,states:{},categories:categories.map(([id,label,definition])=>({id,label,definition,count:rows.filter(r=>r.categoryId===id).length}))};
for(const r of rows)stats.states[r.state]=(stats.states[r.state]||0)+1;
assert.equal(stats.unique,stats.compatible+stats.ports-stats.overlap);assert.equal(stats.unique,stats.categories.reduce((a,c)=>a+c.count,0));
const portRows=source.records.filter(p=>p.repo==='ohos-ports').map(p=>({...p,...classify(p.short_name||p.name,p.description||'',[]),mappingNote:grouped.get(p.original_name||p.name).filter(q=>q.repo==='ohos-ports').length>1?'多发布包映射，需复核':'单一映射'}));
await fs.writeFile(path.join(dir,'classified.json'),JSON.stringify({generatedAt:new Date().toISOString(),sources:source.sources,stats,rows,portRows}));
console.log(JSON.stringify(stats,null,2));
