import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const dir=path.dirname(fileURLToPath(import.meta.url));
const d=JSON.parse(await fs.readFile(path.join(dir,'classified.json'),'utf8'));
const wb=Workbook.create();const summary=wb.worksheets.add('分类汇总');const detail=wb.worksheets.add('三方库明细');const ports=wb.worksheets.add('移植包原始记录');
const last=d.rows.length+4,blue='#234F77',ink='#172B40',muted='#556B80';
for(const s of [summary,detail,ports])s.showGridLines=false;
summary.tabColor=blue;
function title(s,t,end){s.getRange('A2').values=[[t]];s.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:ink};s.getRange('A2:'+end+'2').format.rowHeight=30;s.getRange('A3:'+end+'3').format.borders={bottom:{style:'thin',color:blue}};}
function header(s,range){s.getRange(range).format={fill:blue,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:32,horizontalAlignment:'center',verticalAlignment:'center',wrapText:true};}
const headers=['上游包名','主分类','细分功能','附加功能标签','功能描述（原文摘要）','分类依据','判断状态','清单来源','兼容清单版本','鸿蒙发布包名','稳定版本','Beta版本','弃用状态','弃用说明','功能描述来源','描述元数据版本','描述快照或获取时间','GitHub清单来源','上游npm页面','元数据情况'];
title(detail,'鸿蒙 npm 三方库功能分类明细','T');
detail.getRange('A4:T4').values=[headers];
const clean=t=>String(t||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const excerpt=t=>{t=clean(t);return t.length>300?t.slice(0,297)+'…':t;};
const literal=t=>typeof t==='string'&&t.startsWith('=')?"'"+t:t;
const rows=d.rows.map(r=>[r.name,r.label,r.subcategory,r.additional,excerpt(r.description)||'未取得功能描述',r.basis,r.state,[r.compatible?'兼容清单':'',r.port?'移植清单':''].filter(Boolean).join(' / '),r.compatibleVersions,r.publishedNames,r.stable,r.beta,r.deprecated,excerpt(r.deprecationReason),r.descriptionSource,r.metadataVersion,r.metadataAt,r.sourceUrls,r.npmUrl,r.metadataStatus].map(literal));
for(let i=0;i<rows.length;i+=2000){const batch=rows.slice(i,i+2000);detail.getRangeByIndexes(i+4,0,batch.length,20).values=batch;}
console.log('Wrote detail',rows.length);
const body=detail.getRange(`A5:T${last}`);body.format.font={name:'Arial',size:11,color:ink};body.format.verticalAlignment='center';body.format.rowHeight=58;body.format.wrapText=true;
const widths=[42,26,30,30,95,55,26,24,20,45,20,22,23,65,72,22,29,82,63,37];
widths.forEach((width,i)=>detail.getRangeByIndexes(0,i,last,1).format.columnWidth=width);
detail.getRange(`I5:L${last}`).setNumberFormat('@');detail.getRange(`P5:R${last}`).setNumberFormat('@');
for(let i=0;i<d.rows.length;i++){const r=d.rows[i];const lines=Math.max(Math.ceil(clean(r.description).slice(0,300).replace(/[^\x00-\xff]/g,'aa').length/90),Math.ceil(r.name.length/42),Math.ceil(r.publishedNames.length/45),1);if(lines>3)detail.getRange(`A${i+5}:T${i+5}`).format.rowHeight=Math.min(120,lines*16+8);}
const table=detail.tables.add(`A4:T${last}`,true,'PackageClassification');table.showFilterButton=true;table.style='TableStyleMedium2';header(detail,'A4:T4');
detail.freezePanes.freezeRows(4);detail.freezePanes.freezeColumns(1);
detail.getRange(`G5:G${last}`).conditionalFormats.add('containsText',{text:'待确认',format:{fill:'#FFF1D6',font:{color:'#7A4B00'}}});
detail.getRange(`G5:G${last}`).conditionalFormats.add('containsText',{text:'推断',format:{fill:'#FFF8E8',font:{color:'#7A4B00'}}});
title(summary,'鸿蒙 npm 三方库功能分类汇总','G');
summary.getRange('A4').values=[['清单获取日期：2026-09-29。每个上游包只计入一个主分类，附加标签不重复计数。']];
summary.getRange('A4').format.font={name:'Arial',size:11,color:muted};
summary.getRange('A6:G6').values=[['功能分类','上游包数','占全部包比','兼容清单命中','移植清单命中','有描述规则依据','功能范围']];
const cats=d.stats.categories;
for(let i=0;i<cats.length;i++){
 const row=i+7,c=cats[i];summary.getRange(`A${row}`).values=[[c.label]];summary.getRange(`G${row}`).values=[[c.definition]];
 const group=d.rows.filter(r=>r.categoryId===c.id);
 // Import the classifier's audited statistics snapshot; Excel calculates ratios and totals.
 summary.getRange(`B${row}:F${row}`).values=[[c.count,null,group.filter(r=>r.compatible).length,group.filter(r=>r.port).length,group.filter(r=>r.state.endsWith('描述规则分类')).length]];
}
summary.getRange('A25').values=[['合计（上游包）']];
summary.getRange('A27').values=[['分类依据分布']];summary.getRange('A27').format.font={bold:true,size:13};
summary.getRange('A28:C28').values=[['判断状态','包数','含义']];
const states=[['描述规则分类','主分类规则命中当前取得的功能描述'],['历史描述规则分类','主分类规则命中历史功能描述，使用时核对当前功能'],['关键词规则分类','主分类规则命中元数据关键词'],['重点包功能规则','按常用包主功能进行明确映射'],['包名推断','按包名或生态命名推断，须复核'],['待确认','未命中规则或功能证据不足']];
states.forEach(([state,note],i)=>{const row=29+i;summary.getRange(`A${row}:C${row}`).values=[[state,d.stats.states[state]||0,note]];});
summary.getRange('A36').values=[['口径与数据来源']];summary.getRange('A36').format.font={bold:true,size:13};
const notes=[
 `原始记录 ${d.stats.raw.toLocaleString('en-US')} 条；上游包 ${d.stats.unique.toLocaleString('en-US')} 个。兼容清单 ${d.stats.compatible.toLocaleString('en-US')} 个，移植清单 ${d.stats.ports.toLocaleString('en-US')} 个，交集 ${d.stats.overlap} 个。`,
 '汇总按仓库 original_name 归并，保留 @scope 和标点。部分上游映射存疑；2263 条移植记录及各自分类另列原始记录页。',
 '功能分类沿用本项目的 18 类 npm 标签。通用编程工具库对应旧称“开发基础库”；浏览器自动化、Word/PPT/Excel/PDF 归办公类。',
 '优先使用重点包映射，其次匹配包名、描述与关键词；仍无匹配时使用生态命名规则，无法判断则归其他/待确认。',
 '一包一个主分类，附加标签不重复计数。统计为本次分类快照，编辑明细后需重新汇总；规则分类未经逐库人工确认。',
 'npm 批量查询遇限流。描述补充使用既有 npm 快照及 npms 历史元数据；描述版本与鸿蒙适配版本分别列出。',
 '兼容清单为上游 AI 验证声明；移植记录中 2248 条仅有 Beta、4 条已弃用。本表不新增真机验证结论。',
 'ohos-compatible-packages 提交：9b4d99bcbc6b00889c4f4967e09baaff641231bb',
 'https://github.com/ohos-ports/ohos-compatible-packages/tree/9b4d99bcbc6b00889c4f4967e09baaff641231bb/data',
 'ohos-ports 提交：8af9e3cee540e44b21faa035d48f3f5c9e189bf1',
 'https://github.com/ohos-ports/ohos-ports/blob/8af9e3cee540e44b21faa035d48f3f5c9e189bf1/docs/data/packages.jsonl',
 '功能描述：npm registry /latest；既有 npm 快照（2026-09-14）；移植仓库；npms /v2/package/mget 历史索引。逐包来源见明细 O、Q、R 列。'
];
notes.forEach((v,i)=>summary.getRange(`A${37+i}`).values=[[v]]);
summary.getRange('A6:G25').format.font={name:'Arial',size:11,color:ink};summary.getRange('A6:G25').format.rowHeight=38;summary.getRange('A6:G25').format.verticalAlignment='center';summary.getRange('G7:G24').format.wrapText=true;
summary.getRange('A28:C34').format.font={name:'Arial',size:11,color:ink};summary.getRange('A28:C34').format.rowHeight=30;
summary.getRange('A37:G48').format.font={name:'Arial',size:11,color:muted};summary.getRange('A37:G48').format.rowHeight=27;
[['A',29],['B',15],['C',19],['D',18],['E',18],['F',22],['G',75]].forEach(([c,w])=>summary.getRange(`${c}1:${c}48`).format.columnWidth=w);
header(summary,'A6:G6');header(summary,'A28:B28');summary.getRange('C28').format.font={bold:true};
summary.getRange('B7:F25').setNumberFormat('#,##0');summary.getRange('C7:C25').setNumberFormat('0.0%');summary.getRange('B29:B34').setNumberFormat('#,##0');
summary.getRange('A25:G25').format.fill='#E8EFF6';summary.getRange('A25:G25').format.font.bold=true;
const portLast=d.portRows.length+4;
title(ports,'鸿蒙移植包原始发布记录','M');
ports.getRange('A4:M4').values=[['鸿蒙发布包名','仓库标注上游名','主分类','细分功能','功能描述（原文摘要）','稳定版本','Beta版本','弃用标记','弃用说明','映射检查','分类判断状态','发布包页面','清单来源']];
ports.getRange(`A5:M${portLast}`).values=d.portRows.map(p=>[p.name,p.original_name,p.label,p.subcategory,excerpt(p.description)||'未提供描述',p.stable_version||'',p.beta_version||'',p.deprecated?'已弃用':'未标记弃用',p.deprecated_message||'',p.mappingNote,p.state,p.npm_url||'',p.sourceUrl].map(literal));
ports.getRange(`A5:M${portLast}`).format={font:{name:'Arial',size:11,color:ink},verticalAlignment:'center',wrapText:true,rowHeight:82};
[48,43,26,32,95,20,22,17,65,28,25,72,82].forEach((w,i)=>ports.getRangeByIndexes(0,i,portLast,1).format.columnWidth=w);
ports.getRange(`F5:G${portLast}`).setNumberFormat('@');
const pt=ports.tables.add(`A4:M${portLast}`,true,'OriginalPortRecords');pt.style='TableStyleMedium2';pt.showFilterButton=true;header(ports,'A4:M4');ports.freezePanes.freezeRows(4);ports.freezePanes.freezeColumns(1);
ports.getRange(`J5:J${portLast}`).conditionalFormats.add('containsText',{text:'需复核',format:{fill:'#FFF1D6',font:{color:'#7A4B00'}}});
console.log('Finished all values and formatting');
summary.getRange('C7:C24').formulas=cats.map((_,i)=>[`=B${i+7}/$B$25`]);
summary.getRange('B25:F25').formulas=[['=SUM(B7:B24)','=SUM(C7:C24)','=SUM(D7:D24)','=SUM(E7:E24)','=SUM(F7:F24)']];
console.log('Wrote summary formulas');
wb.recalculate();
console.log('Recalculated');
assert.equal(summary.getRange('B25').values[0][0],d.stats.unique);assert.equal(summary.getRange('D25').values[0][0],d.stats.compatible);assert.equal(summary.getRange('E25').values[0][0],d.stats.ports);
cats.forEach((c,i)=>assert.equal(summary.getRange(`B${i+7}`).values[0][0],c.count));
console.log((await wb.inspect({kind:'table',range:'分类汇总!A6:F10',include:'values,formulas',tableMaxRows:5,tableMaxCols:6,maxChars:2500})).ndjson);
console.log((await wb.inspect({kind:'match',range:'分类汇总!A1:G48',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#SPILL!',options:{useRegex:true,maxResults:20},maxChars:1000})).ndjson);
for(const [sheetName,range,name] of [['分类汇总','A1:G25','summary'],['分类汇总','A27:G48','method'],['三方库明细','A2:G10','detail'],['移植包原始记录','A2:E9','ports']]){const blob=await wb.render({sheetName,range,scale:1,format:'png'});await fs.writeFile(path.join(dir,`preview-${name}.png`),new Uint8Array(await blob.arrayBuffer()));}
console.log('Rendered workbook');
const output=await SpreadsheetFile.exportXlsx(wb);await output.save(path.join(dir,'鸿蒙npm三方库功能分类_20260929.xlsx'));
await fs.writeFile(path.join(dir,'verification.json'),JSON.stringify({stats:d.stats,uniqueCheck:true,categoryCountsCheck:true,sourceCountsCheck:true,rows:rows.length,columns:headers.length,exportedAt:new Date().toISOString()},null,2));
console.log('Workbook exported');
