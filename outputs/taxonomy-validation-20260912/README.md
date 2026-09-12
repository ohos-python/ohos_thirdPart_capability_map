# 分类验证研究数据

快照日期：2026-09-12。此目录服务于分类验证，不是鸿蒙真机适配测试报告。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `local-source.json` | 原工作簿“项目三方库总表”抽出的 601 条完整项目行，保留 `sourceRow` 追溯位置 |
| `github-global.json`、`github-01.json` 至 `github-15.json` | GitHub REST 搜索元数据及查询条件、采集时间 |
| `extra-*.json` | 定向补充仓库的公开页面元数据，保留来源和时间 |
| `analysis.json` | `domains` 分类、`locals` 本地项目、`github` 样本、`standards` 参考体系、`issues` 边界问题、`stats` 汇总 |
| `analyze.mjs` | 包名/项目名与关键词规则、去重、分母筛选和统计逻辑 |
| `鸿蒙三方库15类分类验证与GitHub高星项目对照.xlsx` | 已生成的五工作表研究成果 |
| `extract_sources.py` | 可选：从另行提供的原始 Excel 重新抽取项目行 |
| `fetch_github.mjs`、`fetch_extra.mjs` | 可选：重新采集公开 GitHub 元数据，会改变快照 |
| `build_workbook.mjs` | 可选：通过 `@oai/artifact-tool` 重建研究表 |

高星样本由全局搜索、15 组定向关键词和补充代表仓库组成，去重后 165 个；搜索有结果数量上限，不是穷尽式或随机抽样。仓库主语言未知时保持未知。条目不保证均为 OSI 开源许可证。

## 离线复现分类

在仓库根目录执行，无需 npm 安装：

```sh
node outputs/taxonomy-validation-20260912/analyze.mjs
```

输入为本目录 JSON 快照及根目录 `third-party-satisfaction-cleaned-v2.js`，输出 `analysis.json`；生成时间会变化。正常基线为本地 601 条、583 个归一标识、458 条参与分类验证、425 条已归类；GitHub 165 个样本、113 个参与验证、110 个已归类。规则归类尚需人工复核。

## 可选上游重跑

原始 `全部项目三方库归一总结表.xlsx` 不在本目录，已抽取数据足够完成上述离线流程。若另有原表，可安装 Python `openpyxl` 后执行：

```sh
python outputs/taxonomy-validation-20260912/extract_sources.py /path/to/全部项目三方库归一总结表.xlsx
```

抽取器要求工作表名和列布局保持一致。更新 GitHub 快照需联网并遵守 API 限流；采集脚本仅用于读取元数据，不克隆或执行样本项目。更新输入后需依次重跑分析、复核分类、重新生成研究表。

`build_workbook.mjs` 依赖原制作环境的 `@oai/artifact-tool`，该依赖未随仓库提供，也不保证可从公共 npm 获取。因此普通克隆环境可以重跑 JSON 分析、直接查看现成 Excel，但不承诺可直接重建 Excel；需提供兼容环境或将导出器迁移到通用库。页面本身不需要此依赖。
