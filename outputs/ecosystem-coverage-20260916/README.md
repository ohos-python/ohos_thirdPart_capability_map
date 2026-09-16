# Node.js / C/C++ 双指标分析底稿

**当前C/C++已切换为ConanCenter + Homebrew联合分析，以下vcpkg-only部分是历史口径。** 最新方法、去重依据、安装量单位及复现步骤见[NATIVE-METHOD.md](NATIVE-METHOD.md)，最新汇总见[SUMMARY.md](SUMMARY.md)。历史数据保存在cpp-vcpkg-baseline.json；Conan/Homebrew新页面仍使用原cpp-coverage.html入口。

## 范围

延续Python“库数量 + 下载权重”的计算方法，但不伪装相同分母：

- Node.js：既有项目依赖池，经npm官方包元数据确认、按canonicalName去重。采集2026-08-16至2026-09-14（UTC，包含首尾）官方下载量。不是完整npm下载Top5万。
- C/C++：固定Git commit的vcpkg官方目录，读取ports/*/vcpkg.json，剔除vcpkg-*构建辅助脚本。不是全部C/C++，包中包含工具、运行时及上游项目的分模块。
- 不使用包搜索排名代替下载排名；未确认npm全生态Top5万分母完整性。
- 历史vcpkg口径没有可比下载数据。当前页面已纳入Homebrew安装子集与Conan热门榜10个库下载计数，两个指标单独显示；其余1,938个Conan包族下载计数未知，热门榜时间窗口未说明。

## 文件

- collect.mjs：官方API采集与固定版本vcpkg元数据提取；只读取归档内的JSON，不执行上游源码。
- npm-downloads.json：固定窗口逐包下载快照，缺失保留null。
- 页面逐包downloadSource提供等价的单包查询链接；实际采集请求（包括批量查询URL）记录在npm-downloads.json中，避免页面重复携带很长的批量包名列表。
- vcpkg-registry.json：固定commit的完整manifest快照及归档SHA256。
- classify.mjs：可审计的唯一主标签分类规则。
- build.mjs：目录匹配、加总校验、页面数据与报告生成。
- nodejs-coverage-data.json / cpp-coverage-data.json：逐库完整贡献及汇总。
- SUMMARY.md：各场景数量和权重的精确汇总。

## 来源与匹配

npm元数据分母来自仓库内`outputs/taxonomy-validation-20260912/registry-metadata.json`。支持目录读取父目录的`ohos-compatible-packages/data/*.jsonl`（45,748条兼容包）和`ohos-ports/docs/data/packages.jsonl`（665条发布记录，按original_name映射上游）。再合入用户确认的electron/playwright。原始scope与标点保留，不做Python风格归一化。发布条目包括Beta和弃用记录，匹配证据中明确提示；包名命中不代表所有版本可用。

C/C++分子读取根目录`c-library-capabilities.js`，采用不区分大小写的同名匹配。没有把boost整库匹配外推到全部boost-*，没有任意剥离lib前缀；不命中项可能属于别名或粒度问题，需后续核对。

功能分类使用主标签：Node.js沿用首页18个标签，C/C++沿用首页21个标签。C/C++已匹配条目保留目录主标签，其余按包名、官方功能描述/关键词规则分类。未识别项保留“其他/待确认”，不从总量剔除。全部属于阶段分类，而非人工逐包复核结论。

## 复现

在仓库根目录运行（Node.js内置模块，无额外依赖）：

```sh
node outputs/ecosystem-coverage-20260916/collect.mjs
node outputs/ecosystem-coverage-20260916/build.mjs
node --test tests/ecosystem-coverage.test.cjs tests/python-top50k.test.cjs tests/scenarios-v1.test.cjs
```

采集会复用已成功的同一窗口快照；不会主动刷新已缓存的vcpkg commit。重新选择窗口/快照应建立新的分析目录，不覆盖历史证据。重建需要父目录的两个适配源仓库；只展示静态页面不需要这些原始文件。

页面发布只需要新增的两份HTML、两份`*-coverage-data.js`、共享`ecosystem-coverage.js`和`ecosystem-coverage.css`，以及既有`python-top50k.css`。浏览器不会读取本目录大文件，不依赖后端或第三方CDN。

## 未完成事项

- npm全生态同一窗口Top5万下载分母仍未取得；现有项目样本不能外推其覆盖率。
- Conan全量下载加权覆盖率尚不可计算，需取得同窗的全量逐库统计；已展示的82.18%是Homebrew安装子集加权覆盖率，不是Conan下载覆盖率。
- 同名匹配仍待补别名、版本矩阵与上游拆包映射，以及鸿蒙真机端到端证据。

官方说明：[npm下载API](https://github.com/npm/registry/blob/main/docs/download-counts.md)、[微软vcpkg注册表](https://learn.microsoft.com/en-us/vcpkg/concepts/registries)。
