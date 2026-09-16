# Python 排名分母敏感性趋势

仅Python。总体1张、21个唯一主标签各1张；每张仅显示累计覆盖率折线图。新增排名区间柱状图已移除，数值仍保留在可展开表格及JSON中。SVG为矢量原图，PNG为可直接用于报告的图片。

合并入口：仓库根目录 `python-top50k.html`。原Top5万覆盖统计、场景详情与22张趋势图已直接合并在同一页，顶部导航可以定位到趋势图区，不使用iframe。`python-rank-trends.html`保留为独立查看入口。已纳入GitHub发布文件，页面运行无需外部接口。

## 统计口径

- 使用既有2026-08-16—2026-09-14 UTC的ClickPy下载日志镜像快照，不是重新采集或BigQuery复核结果。原快照计数口径变化、同步完整性等限制仍适用。
- 横轴是全局Python下载排名Top1万至Top10万，不是时间，也不是新增适配数量。场景图从各全局TopN子集取本场景的包，并非场景内各取N万个包。
- 适配清单固定为python-library-capabilities.js，按PEP503包名归一匹配，不核验版本、平台或端到端。唯一主标签沿用packages-classified.jsonl，未分类条目仍保留。
- 累计覆盖率 = 当前TopN内同场景命中库下载量 / 当前TopN内同场景全部下载量。
- 新增区间覆盖率 = 全局排名(N−1)万+1至N万内同场景命中库下载量 / 该区间同场景全部下载量。
- `changePp` 是当前累计值减上一档，单位百分点；可以为正。零分母使用null，不填0，也不跨无数据点连线。
- 折线图使用每图独立的局部纵轴以展示微小变化，跨图不得比较斜率。精确比率与原始计数保存在summary.json及HTML可展开表格中。

## 结果核对

- 22组 × 10档 = 220个聚合点；每档21个标签逐项加总与总体一致。
- 全部场景Top5万数据均与已发布Python Top5万汇总一致。
- 总体75.8526% → 75.4325%，下降0.4202个百分点；测试与质量场景在Top1万→Top2万有一次回升，其后下降。
- 本次静态图已检查总体与测试场景图片。没有把图片检查当作浏览器或鸿蒙运行验收。

## 复现

此次发布包含聚合快照、22份SVG、22份PNG、生成/渲染脚本、核对用Top5万summary.json及测试；不包含原始ranking.json与packages-classified.jsonl。直接展示和运行测试无需这两个大型输入，从原始数据重建则需另行提供。

在仓库根目录运行：

```sh
node outputs/pypi-top100k-20260915/build-rank-trends.mjs
node outputs/pypi-top100k-20260915/render-rank-trends.cjs /path/to/node_modules/sharp
node --test tests/python-rank-trends.test.cjs
```

第二步是可选PNG导出，HTML只需要22份SVG，不依赖sharp或原始10万行数据。合并页另加载python-rank-trends.css，样式仅作用于趋势图区，不影响其他语言页面。第一步需要ranking.json、packages-classified.jsonl、Top5万summary.json及python-library-capabilities.js；summary.json保留输入哈希。生成器通过PYTHON_RANK_TRENDS标记更新合并区域，可重复运行而不重复插入图表、不覆盖原Top5万交互内容。
