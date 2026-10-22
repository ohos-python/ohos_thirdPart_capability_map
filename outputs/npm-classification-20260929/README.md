# 鸿蒙 npm 三方库功能分类

数据快照日期：2026-09-29。上传日期：2026-10-22。本次发布沿用已生成的分类结果，未重新获取 10 月清单。

[下载 Excel 分类表](./鸿蒙npm三方库功能分类_20260929.xlsx)

## 内容与口径

工作簿包含“分类汇总”“三方库明细”“移植包原始记录”。共收录 48,011 条原始记录，依据仓库 `original_name` 映射归并为 47,797 个上游包标识；其中 41,674 个已分配功能类别，6,123 个保留为“其他/待确认”。使用 18 类功能标签（含待确认）。

- 兼容清单：45,748 个包。
- 移植清单：2,263 条发布记录，对应 2,250 个上游包标识。
- 两份清单交集：201 个上游包标识。
- 已取得功能描述：35,058 个包，包含历史元数据。

分类按重点包映射、包名、描述、关键词和生态命名规则完成，未经逐库人工审核。包名推断、历史描述、待确认、Beta、弃用及多发布包映射均保留在数据中。分类汇总是本次快照，修改 Excel 明细后须重新统计。本次分类不新增鸿蒙真机验证结论。

## 来源

- [ohos-compatible-packages 固定提交](https://github.com/ohos-ports/ohos-compatible-packages/tree/9b4d99bcbc6b00889c4f4967e09baaff641231bb/data)
- [ohos-ports 固定提交发布清单](https://github.com/ohos-ports/ohos-ports/blob/8af9e3cee540e44b21faa035d48f3f5c9e189bf1/docs/data/packages.jsonl)
- npm 官方元数据、2026-09-14 npm 元数据缓存，以及 npms 历史索引。npm 接口限流后以历史描述补充缺失信息；逐包描述来源和日期见明细。

## 文件与复现

| 文件 | 内容 |
| --- | --- |
| `鸿蒙npm三方库功能分类_20260929.xlsx` | 分类汇总、可筛选明细和移植原始记录 |
| `classified.json.gz` | 完整分类结果、分类依据、来源、统计和原始移植记录 |
| `source-records.json.gz` | 两个仓库的原始清单及提交、来源路径和文件摘要 |
| `npm-metadata.jsonl.gz` | 当次 npm 元数据查询结果 |
| `npms-metadata.jsonl.gz` | 补充的历史元数据查询结果 |
| `registry-metadata.json.gz` | 复用的 npm 历史缓存，只包含本分类流程使用的生态 |
| `classify.mjs` | 分类规则与归并程序，自动读取同目录压缩快照 |
| `build-workbook.mjs` | Excel 生成程序，需要可用的 `@oai/artifact-tool` 环境 |
| `verification.json` | 导出时的统计及核对记录 |
| `manifest.json` | 原始数据压缩文件大小及 SHA-256 |

使用 Node.js 在仓库根目录运行以下命令，无需联网即可重新分类：

```sh
node outputs/npm-classification-20260929/classify.mjs
```

结果写入同目录 `classified.json`。有 `@oai/artifact-tool` 环境时，可继续运行 `build-workbook.mjs` 重新生成 Excel。发布时使用 gzip 保存大型 JSON 快照；Excel 可直接下载打开。
