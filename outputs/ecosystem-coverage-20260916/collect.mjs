import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../..');
const sha=b=>createHash('sha256').update(b).digest('hex');
const save=(name,data)=>fs.writeFile(path.join(dir,name),JSON.stringify(data,null,2)+'\n');
async function cached(name,make){try{return JSON.parse(await fs.readFile(path.join(dir,name),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}const value=await make();await save(name,value);return value;}
async function request(url,binary=false){
  let last;
  for(let attempt=0;attempt<3;attempt++){
    try{const r=await fetch(url,{headers:{'User-Agent':'ohos-capability-map-research','Accept':'application/json'},signal:AbortSignal.timeout(45000)});
      if(r.status===429||r.status>=500){const retry=r.headers.get('retry-after');const seconds=retry?Number(retry):NaN;const wait=Number.isFinite(seconds)?seconds*1000:r.status===429?30000:1500*(attempt+1);await new Promise(r=>setTimeout(r,Math.max(1500,wait)));throw Error('HTTP '+r.status);}
      if(!r.ok)throw Error('HTTP '+r.status);
      return binary?Buffer.from(await r.arrayBuffer()):await r.json();
    }catch(e){last=e;}
  }throw last;
}
async function npm(){
  const bytes=await fs.readFile(path.join(root,'outputs/taxonomy-validation-20260912/registry-metadata.json'));
  const source=JSON.parse(bytes);
  const candidates=Object.values(source.packages).filter(r=>r.ecosystem==='JavaScript/TypeScript');
  const packages=[...new Set(candidates.filter(r=>r.httpStatus===200).map(r=>r.canonicalName||r.name))].sort();
  const start='2026-08-16',end='2026-09-14';
  const file='npm-downloads.json';let snapshot=await cached(file,async()=>({start,end,sourceSha256:sha(bytes),requested:packages.length,records:{}}));
  if(snapshot.start!==start||snapshot.end!==end||snapshot.sourceSha256!==sha(bytes))throw Error('npm cache scope changed');
  const todo=packages.filter(n=>!snapshot.records[n]||snapshot.records[n].downloads===null);
  const plain=todo.filter(n=>!n.startsWith('@')),jobs=todo.filter(n=>n.startsWith('@')).map(n=>[n]);
  for(let i=0;i<plain.length;i+=100)jobs.push(plain.slice(i,i+100));
  let completed=0,next=0;
  await Promise.all(Array.from({length:1},async()=>{
    while(next<jobs.length){const batch=jobs[next++],url=`https://api.npmjs.org/downloads/point/${start}:${end}/${batch.map(encodeURIComponent).join(',')}`;
      try{const data=await request(url);for(const name of batch){const r=batch.length===1?data:data[name];
        const valid=r?.package===name&&r.start===start&&r.end===end&&Number.isSafeInteger(r.downloads)&&r.downloads>=0;
        snapshot.records[name]={name,downloads:valid?r.downloads:null,start,end,url,fetchedAt:new Date().toISOString(),error:valid?null:'Missing or inconsistent response'};
      }}catch(e){for(const name of batch)snapshot.records[name]={name,downloads:null,start,end,url,error:e.message};}
      completed++;if(completed%25===0){console.log(`npm ${completed}/${jobs.length} queries`);await save(file,snapshot);}
      await new Promise(r=>setTimeout(r,1250));
    }
  }));
  snapshot.generatedAt=new Date().toISOString();snapshot.candidateNames=candidates.length;
  await save(file,snapshot);console.log(`npm: ${packages.length} denominator packages; ${Object.values(snapshot.records).filter(r=>r.downloads!==null).length} downloads resolved`);
}
async function vcpkg(){
  await cached('vcpkg-registry.json',async()=>{
    const commit=await request('https://api.github.com/repos/microsoft/vcpkg/commits/master');
    const url=`https://codeload.github.com/microsoft/vcpkg/tar.gz/${commit.sha}`;
    const archive=await request(url,true),tar=gunzipSync(archive);const ports=[];
    for(let off=0;off+512<=tar.length;){const name=tar.toString('utf8',off,off+100).split('\0')[0];if(!name)break;
      const size=parseInt(tar.toString('ascii',off+124,off+136).replace(/\0/g,'').trim()||'0',8);
      if(!Number.isFinite(size)||size<0)throw Error('Invalid tar entry');
      if(/^[^/]+\/ports\/[^/]+\/vcpkg\.json$/.test(name)){
        const raw=tar.subarray(off+512,off+512+size);const p=JSON.parse(raw.toString('utf8'));
        ports.push({name:p.name,description:Array.isArray(p.description)?p.description.join(' '):p.description||'',homepage:p.homepage||'',version:p.version||p['version-semver']||p['version-string']||p['version-date']||'',supports:p.supports||null,dependencies:(p.dependencies||[]).map(x=>typeof x==='string'?x:x.name),sourceUrl:`https://github.com/microsoft/vcpkg/blob/${commit.sha}/ports/${p.name}/vcpkg.json`,sha256:sha(raw)});
      }
      off+=512+Math.ceil(size/512)*512;
    }
    if(ports.length<1000)throw Error('Incomplete vcpkg archive');
    console.log(`vcpkg: ${ports.length} manifests`);
    return {generatedAt:new Date().toISOString(),commit:commit.sha,url,archiveSha256:sha(archive),definition:'Current ports with vcpkg.json in the official registry; includes build helpers; not a complete C/C++ ecosystem',packages:ports.sort((a,b)=>a.name.localeCompare(b.name))};
  });
}
// Homebrew is an optional, separately labelled proxy; never merged with npm downloads.
async function brew(){await cached('homebrew-analytics.json',async()=>{
  const url='https://formulae.brew.sh/api/analytics/install/homebrew-core/30d.json';
  const data=await request(url);return {fetchedAt:new Date().toISOString(),url,data};
});}
const tasks=process.argv.includes('--brew')?[brew()]:[npm(),vcpkg()];
await Promise.all(tasks);
