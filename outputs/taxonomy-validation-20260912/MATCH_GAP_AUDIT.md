# 三方库目录低匹配原因审计

审计时间：2026-09-14。

## 结论

当前低匹配不是单一原因，**项目样本结构和鸿蒙化目录数据两边都有问题**：

1. 最大的可量化原因是生态范围不一致。清洗后共有4,820个唯一需求库，其中Go 1,569、Rust 179、Java 105、ArkTS 9，共1,862个（38.6%）没有对应鸿蒙化目录，天然无法匹配。
2. 在已有目录可比较的Python、JavaScript/TypeScript、C/C++中，共2,958个唯一需求库，命中1,895个，匹配率64.1%；仍有1,063个目录差距。因此即使剔除缺失生态，完成目录也没有覆盖全部真实项目依赖。
3. 项目样本明显偏向近期GitHub热门项目：601条项目记录中428条来自“GitHub月榜24-26”（71.2%）；333条有依赖记录的项目中226条来自该来源（67.9%）。这些样本集中在AI Agent、云原生、运维、数据库和开发工具，Go模块、近期新包、作用域包及平台二进制依赖较多，与通用npm/PyPI下载Top榜的分布并不相同。
4. 完成目录本身存在需要复查的信号。当前V1项目来源池中有365个Python需求未命中本地完成目录，其中335个（91.8%）仍能从PyPI官方接口取得有效项目条目；`openai`、`fastapi`、`anthropic`等官方主包也存在于PyPI但不在当前Python目录，而目录中包含大量名称带这些关键词的派生包。这不能证明这些主包已经完成鸿蒙化，但说明“Top 5万候选如何生成、如何筛成完成目录”的过程必须回溯。
5. Node.js在当前仓库只有46,413条汇总数，没有逐库名称、版本、来源日期和完成证据，因而无法独立复算“哪些npm包已经完成”。这是数据可审计性问题；现有65.6%匹配结果不能替代原始完成清单。

## 当前可复算数据

| 生态 | 项目需求唯一库 | 目录命中 | 匹配率 | 引用加权匹配率 | 判定 |
|---|---:|---:|---:|---:|---|
| Python | 925 | 548 | 59.2% | 71.2% | 已有目录，但长尾和若干热门主包未命中 |
| JavaScript/TypeScript | 1,984 | 1,302 | 65.6% | 71.5% | 当前仓库缺少Node逐库完成清单，结果不可从零重建 |
| C/C++ | 49 | 45 | 91.8% | 92.8% | 样本很小，不代表C/C++场景全面覆盖 |
| Go | 1,569 | 0 | 0% | 0% | 完成目录数据缺失 |
| Rust | 179 | 0 | 0% | 0% | 完成目录数据缺失 |
| Java | 105 | 0 | 0% | 0% | 完成目录数据缺失 |
| ArkTS | 9 | 0 | 0% | 0% | 未纳入三方库目录 |

上述数据来自 `third-party-satisfaction-cleaned-v2.js`，口径是规范化包名目录匹配，不代表安装、编译、启动和真机验证通过。

## 联网功能证据

对当前场景来源池中的2,903个npm、PyPI和C/C++唯一条目进行了官方注册表只读查询：

- 2,686个取得官方功能描述；
- 47个条目存在但没有简要描述；
- 170个未找到；
- 0个请求失败。

元数据缓存位于 `registry-metadata.json`，采集脚本为 `fetch_registry_metadata.mjs`。npm描述来自官方Registry/package元数据，PyPI描述来自项目JSON API，C/C++优先查询Homebrew Formula API。页面保留每个条目的官方链接和采集结果。

官方文档说明：npm包元数据包含description、keywords、repository等字段；PyPI项目JSON API返回summary、project URLs和release metadata；Homebrew Formula包含软件的一行描述和主页；GitHub API可进一步取得仓库描述、topics、languages和README。

- npm Registry API: https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md
- npm package.json字段: https://docs.npmjs.com/files/package.json/
- PyPI JSON API: https://docs.pypi.org/api/json/
- PyPI下载统计BigQuery数据: https://docs.pypi.org/api/bigquery/
- Homebrew Formula API说明: https://docs.brew.sh/rubydoc/Formula
- GitHub Repository API: https://docs.github.com/en/rest/repos

## 下一步判定顺序

1. 取得Node.js 46,413条逐库原始清单，以及Python Top 5万候选和2.7万完成清单的生成脚本、下载统计窗口、去重规则、完成状态字段。
2. 分开维护“市场候选库”“鸿蒙化工作项”“已构建”“已真机验证”四种状态，不能再用一个“已完成目录”混合表达。
3. V1已用官方/目录功能描述生成场景分配：4,387条关系功能直接命中，3,261条按项目大类回退并标记“需复核”。下一步优先人工审核回退项和跨领域场景边界。
4. 项目分母至少分成“近期GitHub热门样本”“鸿蒙现有项目”“各场景代表性基准项目”三层，分别计算，不把某一批项目当作整个开发领域。
