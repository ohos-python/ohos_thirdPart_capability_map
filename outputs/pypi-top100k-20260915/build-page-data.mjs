// Export a self-contained browser snapshot. No fetch is needed at page load.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const dir=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(await fs.readFile(path.join(dir,'top50k-download-weighted/summary.json'),'utf8'));
const labels={window:{}};
vm.runInNewContext(await fs.readFile(path.resolve(dir,'../../category-display-labels.js'),'utf8'),labels);
const displayLabel=labels.window.CAPABILITY_CATEGORY_LABELS.label;
for(const category of data.categories){
 const oldLabel=category.label;category.label=displayLabel(oldLabel);
 if(category.label!==oldLabel)category.originalLabel=oldLabel;
 for(const row of [...category.topMissing,...category.topMatched])if(row.category)row.category=displayLabel(row.category);
}
data.meta.labelPolicy='显示名称与能力地图首页保持一致；原始分类ID、归属、数量、下载计数和证据等级不变。行业应用与待复核库是domain的显示名称；Top5万仍按本批元数据分类，不沿用首页低置信度行业暂归。';
assert.equal(data.total.packages,50000);
for(const key of ['packages','matchedPackages','totalDownloads','matchedDownloads'])assert.equal(data.categories.reduce((sum,c)=>sum+c[key],0),data.total[key]);
await fs.writeFile(path.resolve(dir,'../../python-top50k-data.js'),'// Generated from the audited Top50k download-weighted summary.\nwindow.PYTHON_TOP50K_COVERAGE = '+JSON.stringify(data,null,2).replace(/</g,'\\u003c')+';\n');
console.log('Generated python-top50k-data.js:',data.categories.length,'categories');
