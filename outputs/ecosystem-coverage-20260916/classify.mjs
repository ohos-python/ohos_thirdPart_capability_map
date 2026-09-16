// Ordered, auditable functional rules. One primary tag per package; fallback stays visible.
export const nodeCategories=[['foundation','开发基础库'],['frontend','前端开发库'],['backend','后端开发库'],['agent','Agent/TUI开发库'],['office','通用办公开发库'],['database','数据库与存储'],['network','网络与通信'],['build','构建与工程工具'],['testing','测试与质量'],['data','数据处理与可视化'],['ai','AI与机器学习'],['multimedia','多媒体与图形'],['security','安全与加密'],['cloud','云服务与DevOps'],['mobile','跨端与移动开发'],['system','系统与原生能力'],['business','业务应用与集成'],['other','其他/待确认']];
// Reviewed against the cached official descriptions. Prevent incidental keywords
// (e.g. CSS in Electron's description, queue in p-limit's keywords) taking precedence.
const nodeOverrides=new Map([
 ...['lru-cache','iconv-lite','picocolors','pretty-format','deepmerge','pump','shell-quote','sisteransi','p-limit','p-queue','p-retry'].map(n=>[n,'foundation']),
 ...['source-map','source-map-js','source-map-support','ignore'].map(n=>[n,'build']),
 ...['electron','chokidar','detect-libc','import-in-the-middle','pako','fflate'].map(n=>[n,'system']),
 ...['form-data','mime','mime-types','mime-db','ipaddr.js'].map(n=>[n,'network']),
 ['axe-core','testing']
]);
const nodeRules=[
 ['office',/\b(playwright|puppeteer|selenium|webdriver|docx|pptx|xlsx|exceljs|office|spreadsheet|pdf|pdfjs|pdfkit|word document|powerpoint|browser automation)\b/i],
 ['agent',/\b(langchain|langgraph|llamaindex|opentui|ink|blessed|inquirer|enquirer|prompts|ora|cli-spinners|terminal ui|tui|model context protocol|mcp server|agent framework|agentic)\b/i],
 ['testing',/\b(jest|vitest|mocha|chai|sinon|ava|tap|nyc|istanbul|cypress|testing-library|test runner|unit test|mocking|test framework|code coverage)\b/i],
 ['build',/\b(typescript|babel|webpack|rollup|esbuild|vite|parcel|tsup|swc|eslint|prettier|postcss|autoprefixer|sass|less|gulp|grunt|bundler|transpil|linter|compiler|build tool|code generator)\b/i],
 ['database',/\b(sqlite|better-sqlite3|mysql|postgres|pg|mongodb|mongoose|redis|ioredis|prisma|sequelize|typeorm|knex|leveldb|levelup|pouchdb|database|sql query|key-value store)\b/i],
 ['security',/\b(bcrypt|argon2|crypto|jsonwebtoken|jose|passport|oauth|authentication|authorization|encryption|jwt|helmet|csrf|cryptograph)\b/i],
 ['ai',/\b(openai|anthropic|tensorflow|transformers|onnx|machine learning|deep learning|neural network|llm|language model|embedding|generative ai)\b/i],
 ['mobile',/\b(react-native|cordova|capacitor|ionic|expo|nativescript|mobile app)\b/i],
 ['cloud',/\b(aws-sdk|azure|google-cloud|firebase|docker|kubernetes|serverless|opentelemetry|prometheus|sentry|telemetry|cloud service)\b/i],
 ['multimedia',/\b(sharp|jimp|canvas|ffmpeg|three|webgl|pixi|image processing|video|audio|media player|image codec|svg render)\b/i],
 ['data',/\b(d3|chart|chartjs|echarts|plotly|vega|csv|dataframe|statistics|data visualization|data visualisation|linear algebra|mathjs)\b/i],
 ['backend',/\b(express|fastify|koa|hapi|nestjs|nest framework|http server|web server|server framework|middleware|graphql|apollo-server|trpc|queue|bullmq)\b/i],
 ['frontend',/\b(react|vue|angular|svelte|jquery|next|nuxt|astro|lit|preact|tailwind|bootstrap|component|frontend|front-end|css|dom|ui toolkit|web component)\b/i],
 ['network',/\b(axios|fetch|http client|https?|websocket|socket|ws|mqtt|grpc|dns|proxy|network|undici|got|request)\b/i],
 ['system',/\b(electron|node-pty|node-gyp|node-addon-api|napi|bindings|ffi|filesystem|file system|child process|native addon|serialport|usb|worker thread)\b/i],
 ['business',/\b(stripe|paypal|payment|commerce|shopify|salesforce|slack|discord|telegram|wechat|blockchain|ethereum|web3|bitcoin)\b/i],
 ['foundation',/\b(lodash|underscore|ramda|core-js|tslib|zod|yup|ajv|joi|winston|pino|log4js|debug|chalk|semver|uuid|nanoid|dayjs|moment|date-fns|yargs|commander|minimist|glob|minimatch|picomatch|fs-extra|graceful-fs|path|buffer|stream|events|async|promise|json|yaml|xml|toml|utility|utilities|polyfill|parser|serialize|validation|string|array|encoding|regular expression|logging)\b/i]
];
const cRules=[
 ['ai',/\b(onnx|ncnn|faiss|tesseract|tensorflow|torch|openvino|machine learning|deep learning|neural network|computer vision|ocr)\b/i],
 ['office',/\b(poppler|mupdf|pdfium|qpdf|docx|pptx|xlsx|opendocument|pdf|epub|hunspell|spell.?check|office document)\b/i],
 ['testing',/\b(gtest|gmock|catch2|doctest|benchmark|testing|unit test|mocking|fuzz|test framework)\b/i],
 ['build',/\b(cmake|meson|ninja|autoconf|automake|libtool|pkgconf|bison|swig|doxygen|llvm|clang|gcc|assembler|compiler|build system|code generator)\b/i],
 ['security',/\b(openssl|boringssl|gnutls|mbedtls|libressl|libsodium|nettle|botan|libgcrypt|gpgme|crypto|cryptography|cryptographic|tls|ssl|certificate|authentication|encryption|obfuscation)\b/i],
 ['database',/\b(sqlite|sqlite3|postgres|postgresql|libpq|mysql|mariadb|mongo|redis|hiredis|rocksdb|leveldb|lmdb|database|key-value|storage engine)\b/i],
 ['network',/\b(curl|libcurl|grpc|nghttp2|libwebsockets|websocket|mqtt|zeromq|nanomsg|c-ares|libssh|dns|http|https|socket|network|networking|rpc|messaging|activemq)\b/i],
 ['serialization',/\b(protobuf|flatbuffers|msgpack|cbor|json|yaml|toml|xml|expat|xerces|serialization|serializer|data encoding)\b/i],
 ['compression',/\b(zlib|zstd|zstandard|lz4|lzma|xz|bzip2|brotli|snappy|libdeflate|libarchive|miniz|compression|decompression|archive library)\b/i],
 ['multimedia',/\b(ffmpeg|gstreamer|sdl|sdl2|openal|portaudio|alsa|pulseaudio|sndfile|vorbis|opus|flac|speex|libass|audio|video|multimedia|subtitle)\b/i],
 ['ui',/\b(qt|qt5|qt6|gtk|gtkmm|wxwidgets|fltk|imgui|nana|widget|gui|user interface|desktop application|clipboard)\b/i],
 ['graphics',/\b(cairo|pixman|freetype|harfbuzz|pango|fontconfig|png|libpng|jpeg|tiff|webp|svg|vulkan|opengl|glfw|glew|shader|image|font|graphics|rendering)\b/i],
 ['science',/\b(eigen|lapack|blas|fftw|gmp|mpfr|armadillo|openblas|gsl|geos|proj|gdal|netcdf|hdf5|algebra|numerical|scientific|optimization|geospatial|geographic|mathematical|geometry)\b/i],
 ['hpc',/\b(openmp|mpi|mpich|openmpi|tbb|opencl|cuda|rocm|simd|parallel|thread pool|lock-free|high performance computing)\b/i],
 ['system',/\b(dbus|wayland|libx11|libxcb|hidapi|libusb|usb|device|posix|inter-process|ipc|shared memory|hardware|serial port|bluetooth|filesystem|file system|process|stack unwinding)\b/i],
 ['tui',/\b(ncurses|curses|readline|libedit|terminal|command.line|argument parser|console)\b/i],
 ['observability',/\b(spdlog|glog|log4c|syslog|opentelemetry|prometheus|sentry|logging|telemetry|metrics|tracing|crash report)\b/i],
 ['runtime',/\b(lua|perl|python|ruby|tcl|javascript engine|scripting|runtime|interpreter|virtual machine)\b/i],
 ['foundation',/\b(boost|abseil|glib|pcre|pcre2|fmt|unicode|gettext|libiconv|uthash|xxhash|utility|utilities|data structures|memory|hash|regular expression|container|string|configuration|date|time|standard library)\b/i]
];
export function classify(ecosystem,p,catalogEntry){
 if(catalogEntry)return {id:catalogEntry.categoryId,basis:'沿用现有C/C++目录主标签（阶段分类）',confidence:'目录标签'};
 if(ecosystem==='node'&&nodeOverrides.has(p.name))return {id:nodeOverrides.get(p.name),basis:'依据缓存的npm官方功能简述进行主标签复核；不由依赖方关键词决定',confidence:'功能描述复核'};
 const text=`${p.name} ${p.description||''} ${(p.keywords||[]).join(' ')}`;
 const rules=ecosystem==='node'?nodeRules:cRules;
 const found=rules.find(([,re])=>re.test(text));
 return {id:found?.[0]||'other',basis:found?`包名/官方功能描述命中 ${found[1].source}`:'没有足够功能证据，保留在分母',confidence:found?'规则分类，需复核':'待确认'};
}
