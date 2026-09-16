const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function load(){const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'category-display-labels.js'),'utf8'),ctx);return ctx.window.CAPABILITY_CATEGORY_LABELS;}
test('Readable labels affect only the requested categories',()=>{
 const api=load();assert.equal(api.label('开发基础库'),'通用编程工具库');
 for(const name of ['业务与行业组件','业务与领域组件'])assert.equal(api.label(name),'行业应用与待复核库');
 assert.equal(api.label('其他/待确认'),'其他/待确认');assert.equal(api.label('业务应用与集成'),'业务应用与集成');
});
for(const file of ['python-library-capabilities.js','c-library-capabilities.js'])test(file+': no raw mutation or count/membership changes',()=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);const source=Object.values(ctx.window)[0],before=JSON.stringify(source),d=load().decorate(source);
 assert.equal(JSON.stringify(source),before);assert.equal(d.libraries.length,source.libraries.length);
 assert.equal(d.categories.length,source.categories.length);
 d.categories.forEach((c,i)=>{assert.equal(c.id,source.categories[i].id);assert.equal(c.recordCount,source.categories[i].recordCount);assert.equal(c.uniqueLibraries,source.categories[i].uniqueLibraries);});
 d.libraries.forEach((r,i)=>{const old=source.libraries[i];assert.equal(r.c||r.categoryId,old.c||old.categoryId);assert.equal(r.n||r.name,old.n||old.name);if(r.categoryId==='foundation')assert.equal(r.category,'通用编程工具库');if(r.categoryId==='domain')assert.equal(r.category,'行业应用与待复核库');});
});
test('Homepage explains mixed confidence and keeps old names as references',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/15,718条记录属于低置信度/);assert.match(html,/此次只优化显示名称/);assert.match(html,/原“开发基础库”/);assert.match(html,/原“业务与行业组件/);
 assert.ok(html.indexOf('src="category-display-labels.js"')<html.indexOf('const pythonCatalog'));
});
