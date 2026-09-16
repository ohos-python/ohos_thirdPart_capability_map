// Public homepage SSR is currently the only verified source of non-zero counts.
// Keep the complete extracted payload and hash; never infer a time window.
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const url='https://conan.io/center';
const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
if(!response.ok)throw Error(`HTTP ${response.status}`);
const bytes=Buffer.from(await response.arrayBuffer()),html=bytes.toString('utf8');
const match=html.match(/<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
assert(match,'Conan homepage SSR data missing');
const payload=JSON.parse(match[1]),data=payload.props.pageProps.data;
assert(Array.isArray(data.popular)&&data.popular.length>0);
const rows=data.popular.map((r,i)=>{assert(typeof r.name==='string'&&Number.isSafeInteger(r.total_downloads)&&r.total_downloads>=0);return {name:r.name,rank:i+1,downloads:r.total_downloads};});
assert.equal(new Set(rows.map(r=>r.name)).size,rows.length);
const result={url,fetchedAt:new Date().toISOString(),rawSha256:createHash('sha256').update(bytes).digest('hex'),field:'props.pageProps.data.popular[].total_downloads',window:null,windowStatus:'官网页面未说明统计窗口；不推断为累计或最近30天',scope:'官方首页热门榜，非全量逐库下载数据',sourceRecipes:data.recipesNum,rows,rawData:data};
await fs.writeFile(fileURLToPath(new URL('conan-popular-downloads.json',import.meta.url)),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({fetchedAt:result.fetchedAt,recipes:result.sourceRecipes,rows}));
