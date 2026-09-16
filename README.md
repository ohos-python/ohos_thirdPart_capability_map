# OpenHarmony 三方库能力地图

基于 OpenHarmony Python、Node.js、C/C++ 三方库适配数据，以及项目清单的 601 条原始项目记录，展示：

- 当前已经具备的三方库能力；
- 尚未覆盖的 Top 库、系统接口和生态；
- 各语言生态的依赖满足度；
- 不同项目类型的平均覆盖率和完全覆盖率；
- 可进入端到端验证的项目候选。

## 页面文件

最新显示调整：原首页及Python Top5万页将“开发基础库”显示为“通用编程工具库”，“业务与行业/领域组件”显示为“行业应用与待复核库”。原始类别ID、库归属和计数不变；Python页前部说明分类来源、规则与下载加权场景支持度。两个标签的详细解释通过轻触展开，统计表、场景详情和趋势图区保持一致。首页运行新增依赖`category-display-labels.js`，Python页新增依赖`python-category-help.js`；Python页面数据已包含新名称和旧名称搜索映射。

当前保留以下独立入口：

- [原版能力地图](index.html)：现有库目录、缺口和项目依赖满足度。
- [场景目录 V1](index-v1.html)：15 个能力大类、135 个候选场景，先决策范围，再评估适配。
- [Python Top5万覆盖与趋势分析](python-top50k.html)：原有数量、下载加权覆盖和场景详情，同页合并Top1万—10万总体及21个场景趋势图。趋势为排名分母敏感性分析，不是时间预测。
- [Node.js覆盖分析](nodejs-coverage.html)：18个标签，1,801个项目依赖样本；不是npm全生态Top5万。数量覆盖73.29%，下载加权覆盖95.40%。
- [C/C++覆盖分析](cpp-coverage.html)：21个标签，ConanCenter与Homebrew原生候选并集2,589个包族，数量覆盖33.76%；Homebrew安装子集覆盖82.18%。Conan官网热门榜10个库下载计数另列，窗口未说明，不是全量下载覆盖率。
- [Node.js / C/C++分析底稿](outputs/ecosystem-coverage-20260916/README.md)；[C/C++口径与来源](outputs/ecosystem-coverage-20260916/NATIVE-METHOD.md)。
- [会话与数据交接](HANDOFF.md)：已达成的结论、统计口径、限制和下一步。
- [V1 使用说明](README-v1.md)；[分类验证数据与复现说明](outputs/taxonomy-validation-20260912/README.md)。

下表为原版页面依赖；V1 仅依赖 `scenarios-v1.css`、`scenarios-v1-data.js`、`scenarios-v1-coverage.js`、`scenarios-v1-library-candidates.js`、`scenarios-v1.js`。

| 文件 | 用途 | 页面运行时是否必需 |
| --- | --- | --- |
| `index.html` | 能力地图页面、场景与能力域定义、交互逻辑 | 是 |
| `python-library-capabilities.js` | Python 三方库分类、版本、适配方式和接口目录 | 是 |
| `c-library-capabilities.js` | C/C++ 三方库分类、版本、描述和接口目录 | 是 |
| `third-party-satisfaction-cleaned-v2.js` | 项目需求清洗结果、覆盖率、项目分类和缺口；Electron、Playwright按已验证支持项计入 | 是 |

页面不依赖后端接口、数据库或第三方 CDN，可以通过 GitHub Pages 静态发布。

Python合并页新增`python-rank-trends.css`及`outputs/pypi-top100k-20260915/rank-trends/`中的22份SVG；该目录同时保存PNG和趋势汇总JSON。`python-rank-trends.html`保留独立查看入口。这里只发布趋势聚合数据及Top5万核对汇总，不夹带原有Top10万大型原始研究文件；重新聚合须另行提供原始ranking.json和packages-classified.jsonl。

Node.js与C/C++页分别依赖同目录的`nodejs-coverage-data.js`、`cpp-coverage-data.js`，共享`ecosystem-coverage.js`、`ecosystem-coverage.css`及`python-top50k.css`。页面不读取outputs；研究快照与脚本用于离线复核。npm窗口为2026-08-16—2026-09-14，Homebrew官方30d窗口为2026-08-17—2026-09-16，两者不能混算。目录命中不等于鸿蒙真机端到端可用。

## 本地预览

直接打开 `index.html`，或在仓库目录运行任意静态文件服务器。例如：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 数据口径

- 适配目录：OpenHarmony Python、Node.js、C/C++ 三方库清单。
- 需求数据：601 条原始项目记录（按当前 URL/名称规则归一后 583 个项目标识）、4,834 条原始三方库记录；各指标分母不同，详见交接文档。
- 清洗处理：剔除 ArkUI/平台占位项、运行时二进制和系统接口；纠正明确的前端生态误分类；统一 C/C++ `lib` 前缀等别名。
- 当前满足度表示依赖名称已进入兼容或移植目录，不代表安装、编译、启动、核心功能和真机测试已经完成。
- Go、Java、Rust 当前缺少可用于适配判断的完整目录数据，统一显示为“数据缺失，待补充”；不按0%能力或场景覆盖解释。
- 用户确认支持项：Node.js `electron`、`playwright` 已纳入满足度；本仓库尚未附上对应真机测试报告，不外推到所有版本、绑定和系统接口。

V1 的浏览器勾选与备注保存在 localStorage，不会随 Git 提交同步；换设备前请使用页面导出 JSON，在新设备导入。

## GitHub Pages

在仓库设置的 Pages 页面中选择：

- Source：`Deploy from a branch`
- Branch：`main`
- Folder：`/ (root)`

发布后根路径会直接加载 `index.html`。
