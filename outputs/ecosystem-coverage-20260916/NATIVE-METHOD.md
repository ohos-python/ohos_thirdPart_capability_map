# C/C++：ConanCenter + Homebrew 当前口径

## 结果与来源

ConanCenter固定commit：`956c2bc807d669225979dd222f1386918dd603da`。按`recipes/<name>/config.yml`统计1,948个包族；配方功能描述通过Python AST读取字面量，零执行、零导入上游代码。0个解析错误，0个描述缺失。包含原生开发工具及运行时，不能把所有配方理解成纯C/C++代码库。

Homebrew/core包目录8,598个formula；保留完整精选字段快照、官方API链接和原始响应哈希。纳入1,472个formula，按以下不依赖鸿蒙支持状态的规则：

1. 与ConanCenter同名、官方别名或已审查的跨名映射可对齐。
2. 官方功能描述明确C/C++。
3. 官方描述为库/框架，具有CMake/Meson/Autotools等原生构建依赖，且未出现Go/Rust/Python等其他语言构建信号（候选，需复核）。
4. 与ConanCenter原生项目共用唯一项目主页的组件候选，可以纳入范围，但不能因此与主包合并。

其余7,126个formula保存在排除审计中，不代表它们不支持鸿蒙，也不代表全部与原生开发无关。Homebrew Casks与第三方taps不在分母内。

## 去重与适配匹配

- 同名、Homebrew官方aliases/oldnames、`@版本`族归一。源码子模块不按项目主页自动合并。
- 跨名映射有限清单：sqlite→sqlite3，xz→xz_utils，node→nodejs，python→cpython，llvm→llvm-core，curl→libcurl；只有对应Conan条目存在且项目主页主机一致时启用。实际使用的映射依据随行导出。
- 不同GitHub项目或多个Conan候选不强行合并。12条歧义保留；迁移/改名和同名异库仍需人工核对。
- 鸿蒙匹配使用联合条目的明确名称、官方别名及版本族，不把支持一个主库自动推广到其他模块。当前不验证版本、架构、安装或端到端。
- 去重后2,589个包族，命中874个（33.76%）。Conan范围668/1,948（34.29%）；Homebrew入选包族683/1,375（49.67%）。不同子集存在交集，不应直接加总。

## 安装热度与未知值

仅使用[Homebrew/core官方安装统计](https://formulae.brew.sh/api/analytics/install/homebrew-core/30d.json)的已观测条目。API窗口字段为2026-08-17至2026-09-16，category为formula_install，30d标签按上游原样展示；不强行调整成npm的固定日期。

- 同一formula的HEAD/选项计数先相加，再汇总同一包族的版本化formula。公式是安装事件之和，不是独立用户去重。
- 入选formula中1,374个有统计，98个未上榜；未上榜保留null，不假定0。合并后1,279个包族有计数，96个含Homebrew的包族完全未观测，其余缺权重的条目来自Conan-only。
- 已观测安装计数8,524,356；对应命中包族安装计数7,005,626；比例82.18%。数量分母是并集，而这个加权分母仅是Homebrew已观测子集，不等价。
- Conan安装/下载量、鸿蒙制品仓历史downloads字段一概不加入。公共数据来自匿名遥测，不是全部平台安装，也不是鸿蒙使用率。见[官方统计说明](https://docs.brew.sh/Analytics)。
- 源API总计14,612,885，可枚举明细加总14,612,876，相差9次，原因未确认。我们只对入选明细求和，不用总计补平分子分母；页面与JSON均保留审计值。
- 共享页面字段`downloads`、`totalDownloads`、`matchedDownloads`在本数据集中表示Homebrew安装事件，`weightKind: homebrew-installs`和`fieldSemantics`明确记录单位；不是Conan下载。

## 复现与历史保护

### Conan 下载补充（2026-09-16）

[Conan 官网首页](https://conan.io/center)的 `__NEXT_DATA__` 中，`props.pageProps.data.popular[].total_downloads` 提供热门榜10个库的非零下载计数。已保存 `conan-popular-downloads.json`（来源、采集时间、响应SHA-256、完整data字段），并在页面独立展示和逐库关联。统计窗口没有说明，不推断为累计或最近30天，不与Homebrew相加。

分母1,948个Conan包族中仅10个取得计数，剩余1,938个未知；全量下载覆盖率保持null。公开搜索API `https://conan.io/api/search/all?topics=&licenses=` 返回1,948个记录，但不含downloads字段。zlib配方详情SSR的downloads=0与热门榜640,352冲突，未采用为真实零值。结论是“目前仅取得部分公开数据”，不是“Conan没有下载统计”。

共享旧字段继续专指Homebrew安装事件；真实Conan计数使用独立的顶层 `conanDownloads` 与逐行 `conanDownloads`。页面显示8,524,356次已观测Homebrew安装、其中7,005,626次命中（82.18%），不是Conan下载覆盖率。

```sh
node outputs/ecosystem-coverage-20260916/collect-native.mjs
python outputs/ecosystem-coverage-20260916/extract-conan.py
node outputs/ecosystem-coverage-20260916/collect-conan-downloads.mjs
node outputs/ecosystem-coverage-20260916/build.mjs
node --test tests/ecosystem-coverage.test.cjs tests/python-top50k.test.cjs tests/scenarios-v1.test.cjs
```

只重新生成C/C++数据也可运行`build-native.mjs`。`collect-native.mjs`复用已缓存快照；`collect-conan-downloads.mjs`会重新请求并更新热门榜快照，需要保留历史时应先归档旧JSON。`conan-index.tar.gz`仅供AST提取，浏览器不读取它。`cpp-vcpkg-baseline.json`保留原始vcpkg结果；新页面平台对照表引用其原值，不重新混入联合分母。Node.js/Python原有统计未改动。
