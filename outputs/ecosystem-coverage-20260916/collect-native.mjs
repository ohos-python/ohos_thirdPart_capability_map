import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const dir=path.dirname(fileURLToPath(import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
async function get(url){const r=await fetch(url,{headers:{'User-Agent':'ohos-capability-map-research'},signal:AbortSignal.timeout(180000)});if(!r.ok)throw Error(`${url}: HTTP ${r.status}`);const bytes=Buffer.from(await r.arrayBuffer());return {bytes,sha256:sha(bytes)};}
async function cached(file,build){try{await fs.access(path.join(dir,file));console.log('reuse '+file);return;}catch{}const d=await build();await fs.writeFile(path.join(dir,file),JSON.stringify(d,null,2)+'\n');console.log('saved '+file);}
await Promise.all([
 cached('homebrew-formulae.json',async()=>{const url='https://formulae.brew.sh/api/formula.json',r=await get(url),data=JSON.parse(r.bytes);return {url,fetchedAt:new Date().toISOString(),rawSha256:r.sha256,packages:data.map(p=>({name:p.name,aliases:p.aliases,oldnames:p.oldnames,versioned_formulae:p.versioned_formulae,description:p.desc,homepage:p.homepage,version:p.versions?.stable,build_dependencies:p.build_dependencies,dependencies:p.dependencies,source:p.urls?.stable?.url,disabled:p.disabled,deprecated:p.deprecated,ruby_source_path:p.ruby_source_path,tap_git_head:p.tap_git_head}))};}),
 cached('homebrew-core-install-30d.json',async()=>{const url='https://formulae.brew.sh/api/analytics/install/homebrew-core/30d.json',r=await get(url);return {url,fetchedAt:new Date().toISOString(),rawSha256:r.sha256,data:JSON.parse(r.bytes)};}),
 cached('conan-source.json',async()=>{const response=await get('https://api.github.com/repos/conan-io/conan-center-index/commits/master'),commit=JSON.parse(response.bytes).sha,url=`https://codeload.github.com/conan-io/conan-center-index/tar.gz/${commit}`,r=await get(url);await fs.writeFile(path.join(dir,'conan-index.tar.gz'),r.bytes);return {commit,url,fetchedAt:new Date().toISOString(),archiveSha256:r.sha256};})
]);
