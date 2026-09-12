import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const out=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(await fs.readFile(path.join(out,'analysis.json'),'utf8'));
const wb=Workbook.create();
const sheets=['分类验证','本地项目','GitHub样本','参考体系','边界与整改'].map(n=>wb.worksheets.add(n));
const [summary,local,gh,std,issues]=sheets;
const col=n=>{let s='';for(n++;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
function table(sh,title,headers,rows,widths,start=5){
 sh.showGridLines=false;
 const last=start+rows.length;
 sh.getRange(`A${start}:${col(headers.length-1)}${last}`).values=[headers,...rows];
 sh.getRange(`A2`).values=[[title]];
 sh.getRange(`A2`).format.font={name:'Arial',size:15,bold:true,color:'#233851'};
 const used=sh.getRange(`A${start}:${col(headers.length-1)}${last}`);
 used.format.font={name:'Arial',size:10,color:'#243449'};
 used.format.verticalAlignment='top';used.format.wrapText=true;used.format.rowHeight=44;
 for(let i=0;i<headers.length;i++)sh.getRange(`${col(i)}${start}:${col(i)}${last}`).format.columnWidth=widths[i]||20;
 const t=sh.tables.add(`A${start}:${col(headers.length-1)}${last}`,true,'T'+sheets.indexOf(sh));
 t.style='TableStyleMedium2';t.showFilterButton=true;
 sh.getRange(`A${start}:${col(headers.length-1)}${start}`).format={fill:'#294C73',font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:32,horizontalAlignment:'center',verticalAlignment:'center'};
 if(rows.length>25){sh.freezePanes.freezeColumns(sh===local?2:1);sh.freezePanes.freezeRows(start);}
 return {start,last};
}
const localRows=data.locals.map(r=>[
 r.id,r.project,r.cat||null,r.category,r.review,r.eligible,r.kind,r.tags,r.oldCategory,r.language||'未记录',r.githubLanguage||'未获取',r.framework||'未记录',r.dependencyCount,r.cleanDependencies,r.sourceMatched,r.sourceCoverage,r.duplicateOf,r.basis,r.source,r.sourceRow,r.url||'',r.key
]);
const lr=table(local,'本地项目分类审计：保留全部601条源记录',
 ['源序号','项目名称','主类编号','建议主分类','证据状态','纳入去重分母(1/0)','对象类型','跨类/行业标签','原页面分类','原表语言','GitHub主语言原值','原框架','原依赖数','清洗后依赖数','目录匹配依赖数','原页面依赖满足度','重复于源序号','分类依据','来源','源Excel行号','原项目链接','规范化项目标识'],localRows,[10,38,10,28,21,13,22,35,28,21,23,26,12,14,15,16,13,58,21,12,52,40]);
local.getRange(`P6:P${lr.last}`).setNumberFormat('0.0%');
local.getRange('A3').values=[['原始来源：全部项目三方库归一总结表.xlsx / 项目三方库总表。满足度沿用当前页面v2；空白表示没有项目级匹配结果。']];
local.getRange('A3:V3').format.font={name:'Arial',size:10,color:'#66758A'};
local.getRange(`E6:E${lr.last}`).conditionalFormats.add('containsText',{text:'不足',format:{fill:'#FFF1D6',font:{color:'#8C4C0A'}}});
local.getRange(`E6:E${lr.last}`).conditionalFormats.add('containsText',{text:'待',format:{fill:'#FFF1D6',font:{color:'#8C4C0A'}}});
const ghRows=data.github.map(r=>[r.full_name,r.stargazers_count,r.cat||null,r.category,r.review,r.eligible,r.kind,r.tags,r.language||'未获取/未识别',(r.description||'').length>200?r.description.slice(0,200)+'…':r.description||'',r.groups.includes('global')?1:0,r.groups.join('、'),r.localRows.join('、'),r.licenseLabel,new Date(r.fetchAt),r.method,r.html_url,r.queries.join('\n'),r.starSource]);
const gr=table(gh,'GitHub高星样本：查询结果按功能重新归类',
 ['仓库','Stars','主类编号','建议主分类','证据状态','纳入分母(1/0)','对象类型','跨类/行业标签','GitHub主语言原值','上游功能描述摘要','全局Top100样本(1/0)','查询组','本地源序号','许可原值/状态','采集时间(UTC)','取数方式','仓库链接','原始查询','取数来源链接'],ghRows,[40,13,10,28,21,13,23,36,23,68,17,24,18,22,23,30,52,63,65]);
gh.getRange(`B6:B${gr.last}`).setNumberFormat('#,##0');gh.getRange(`O6:O${gr.last}`).setNumberFormat('yyyy-mm-dd hh:mm');
// Very long upstream descriptions remain intact and filterable, but only a readable preview is shown in the row.
gh.getRange(`J6:J${gr.last}`).format.wrapText=true;
gh.getRange(`A6:S${gr.last}`).format.rowHeight=86;
gh.getRange('A3').values=[['全局Top100（≥10,000星）＋15个关键词各取最多5项（≥5,000星）＋15个定向补充。去重后165项；不代表行业随机样本。']];
gh.getRange(`E6:E${gr.last}`).conditionalFormats.add('containsText',{text:'待',format:{fill:'#FFF1D6',font:{color:'#8C4C0A'}}});
const sr=table(summary,'鸿蒙三方库15类能力分类验证',
 ['编号','能力类别','本地可归类项目数','GitHub可归类样本数','本地占纳入分母比例','GitHub占纳入分母比例','边界判定','建议补充'],
 data.domains.map(d=>[d.id,d.name,null,null,null,null,d.boundary,d.action]),[8,32,17,19,19,19,54,54],13);
summary.tabColor='#294C73';
summary.getRange('B4:C10').values=[['本地原始记录',data.stats.raw],['规范化URL去重后',data.stats.unique],['本地纳入分类分母',null],['本地可归类比例',null],['GitHub样本总数',data.stats.github],['GitHub纳入分类分母',null],['GitHub可归类比例',null]];
summary.getRange('D4:F10').values=[['分类结论','有条件适用，尚非正式标准认证',null],['参考体系','ACM CCS、SWEBOK、CNCF',null],['仍需处理','行业标签、对象类型、跨类边界',null],['范围待决','IoT/机器人/区块链等',null],['证据限制','本地未逐一联网核验README',null],['适配口径','依赖目录匹配不等于端到端可用',null],['率的定义','可归类数 / 纳入分类分母',null]];
summary.getRange('A4:H10').format.font={name:'Arial',size:10,color:'#243449'};
summary.getRange('A4:H10').format.rowHeight=24;
summary.getRange('C4:C10').format.horizontalAlignment='center';
summary.getRange('E4:H10').format.wrapText=false;
summary.getRange('C6').formulas=[[`=SUM('本地项目'!F6:F${lr.last})`]];
summary.getRange('C7').formulas=[[`=SUM(C14:C28)/C6`]];
summary.getRange('C9').formulas=[[`=SUM('GitHub样本'!F6:F${gr.last})`]];
summary.getRange('C10').formulas=[[`=SUM(D14:D28)/C9`]];
summary.getRange('C7').setNumberFormat('0.0%');summary.getRange('C10').setNumberFormat('0.0%');
for(let i=0;i<15;i++){
 const row=14+i;
 summary.getRange(`C${row}:F${row}`).formulas=[[
 `=COUNTIFS('本地项目'!$C$6:$C$${lr.last},$A${row},'本地项目'!$F$6:$F$${lr.last},1)`,
 `=COUNTIFS('GitHub样本'!$C$6:$C$${gr.last},$A${row},'GitHub样本'!$F$6:$F$${gr.last},1)`,
 `=C${row}/$C$6`,`=D${row}/$C$9`]];
}
summary.getRange('E14:F28').setNumberFormat('0.0%');summary.getRange('C14:D28').setNumberFormat('#,##0');
summary.getRange('B31').values=[['待处理（范围或信息待确认）']];
summary.getRange('C31').formulas=[['=C6-SUM(C14:C28)']];summary.getRange('D31').formulas=[['=C9-SUM(D14:D28)']];
summary.getRange('A33').values=[['分母排除教程/资源/技能资产、ArkUI平台记录与重复记录；信息不足和范围待决项保留在分母。']];
summary.getRange('A34').values=[['上述比例仅表示样本能否归入类别，不表示鸿蒙适配率、分类准确率或全球场景覆盖率。']];
summary.getRange('A35').values=[['只有明确主功能才归类。一个主类加多个标签；消费应用可验证场景需求，但不等于三方库。']];
summary.getRange('A31:H35').format.font={name:'Arial',size:10,color:'#596B82'};
summary.getRange('A31:H35').format.rowHeight=24;
const stdRows=data.standards.map(r=>[...r,new Date('2026-09-12T00:00:00Z')]);
table(std,'参考体系及对齐方式',['参考体系','原本用途','已核实的结构/主题','对本分类的适用范围','官方来源','核查日期'],stdRows,[24,48,65,68,70,16]);
std.getRange('F6:F8').setNumberFormat('yyyy-mm-dd');
std.getRange('A11').values=[['15类工程定义：以下为本次映射判断，不是标准原文或正式条款对应关系。']];
std.getRange('A13:F28').values=[['编号','能力类别','纳入范围','优势语言生态','主要参考方向','边界'],...data.domains.map(d=>[d.id,d.name,d.scope,d.languages,[2,3,4,5,6,14,15].includes(d.id)?'CNCF相关技术分区；SWEBOK相关工程实践':'自定义功能域；采用ACM分层和多主题思想',d.boundary])];
std.getRange('A13:F28').format={font:{name:'Arial',size:10,color:'#243449'},wrapText:true,rowHeight:48,verticalAlignment:'top'};
std.getRange('A13:F13').format={fill:'#294C73',font:{name:'Arial',size:10,color:'#FFFFFF',bold:true},horizontalAlignment:'center',rowHeight:30};
std.getRange('A31').values=[['通过条件：定义和主用途清楚、可追溯、多标签可表达跨域；目前还需行业轴与项目/库/资产类型轴。']];
table(issues,'分类边界、数据问题及整改建议',['问题类型','对象/类别','发现','判定依据','建议动作'],data.issues,[23,36,64,66,66]);
issues.getRange('A3').values=[['本次仅新增验证表，不覆盖现有HTML与分类数据。列出的旧分类问题供下一步修订。']];
// Keep a complete upstream description available without creating oversized rows.
// The table column remains an intact value; user can inspect it in the formula bar.
wb.recalculate();
console.log((await wb.inspect({kind:'table',range:'分类验证!A4:F10',include:'values,formulas',tableMaxRows:7,tableMaxCols:6,maxChars:3500})).ndjson);
console.log((await wb.inspect({kind:'table',range:'分类验证!A14:F28',include:'values,formulas',tableMaxRows:15,tableMaxCols:6,maxChars:4500})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},summary:'公式错误检查',maxChars:1500})).ndjson);
const totals=summary.getRange('C6:C10').values;
if(totals[0][0]!==data.stats.localEligible||Math.abs(totals[1][0]-data.stats.localClassified/data.stats.localEligible)>1e-10||totals[3][0]!==data.stats.githubEligible||Math.abs(totals[4][0]-data.stats.githubClassified/data.stats.githubEligible)>1e-10)throw new Error('Summary counts differ from independent JS counts '+JSON.stringify(totals));
// Verify formula response to a changed source row, then restore it before export.
const first=data.locals.findIndex(r=>r.eligible&&r.cat>0)+6;
local.getRange('F'+first).values=[[0]];
if(summary.getRange('C6').values[0][0]!==data.stats.localEligible-1)throw new Error('Recalculation edit test failed');
local.getRange('F'+first).values=[[1]];wb.recalculate();
for(const [sh,range] of [[summary,'A2:F10']]){
 const p=await wb.render({sheetName:sh.name,range,scale:1.5,format:'png'});
 await fs.writeFile(path.join(out,'preview-'+sh.name+'-'+range.replace(':','-')+'.png'),new Uint8Array(await p.arrayBuffer()));
}
const name='鸿蒙三方库15类分类验证与GitHub高星项目对照.xlsx';
await (await SpreadsheetFile.exportXlsx(wb)).save(path.join(out,name));
console.log('EXPORTED',path.join(out,name));
