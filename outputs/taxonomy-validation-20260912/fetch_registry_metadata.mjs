import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const outputFile=path.join(here,'registry-metadata.json');
const candidateSource=await fs.readFile(path.join(root,'scenarios-v1-library-candidates.js'),'utf8');
const context={window:{}};
vm.createContext(context);
vm.runInContext(candidateSource,context);
const candidates=context.window.SCENARIO_V1_LIBRARY_CANDIDATES;

let previous={packages:{}};
try{previous=JSON.parse(await fs.readFile(outputFile,'utf8'));}catch{}

const supported=new Set(['JavaScript/TypeScript','Python','C/C++']);
const packages=new Map();
for(const library of Object.values(candidates.libraries||{})){
  if(!supported.has(library.ecosystem))continue;
  const key=`${library.ecosystem}|${library.name.toLocaleLowerCase('en-US')}`;
  if(!packages.has(key))packages.set(key,{key,name:library.name,ecosystem:library.ecosystem});
}

const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
const repositoryUrl=value=>{
  const raw=typeof value==='string'?value:value?.url;
  return clean(raw).replace(/^git\+/,'').replace(/\.git$/,'');
};
const npmUrl=name=>`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`;
const pypiUrl=name=>`https://pypi.org/pypi/${encodeURIComponent(name)}/json`;
const brewNames=name=>[name,name.replace(/^lib(?=[a-z0-9])/i,'')]
  .map(value=>value.toLocaleLowerCase('en-US').replace(/[^a-z0-9@+._-]+/g,'-'))
  .filter((value,index,array)=>value&&array.indexOf(value)===index);

async function requestJson(url){
  let lastError;
  for(let attempt=0;attempt<3;attempt+=1){
    try{
      const response=await fetch(url,{headers:{accept:'application/json','user-agent':'ohos-capability-map-metadata-audit/1.0'}});
      if(response.status===404)return {status:404};
      if(response.status===429||response.status>=500){
        await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));
        continue;
      }
      if(!response.ok)return {status:response.status};
      return {status:response.status,data:await response.json()};
    }catch(error){
      lastError=error;
      await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));
    }
  }
  return {status:0,error:lastError?.message||'request failed'};
}

async function fetchMetadata(item){
  if(item.ecosystem==='JavaScript/TypeScript'){
    const url=npmUrl(item.name);
    const result=await requestJson(url);
    if(!result.data)return {...item,registry:'npm',registryUrl:`https://www.npmjs.com/package/${item.name}`,fetchUrl:url,httpStatus:result.status,error:result.error||null};
    const data=result.data;
    return {...item,registry:'npm',registryUrl:`https://www.npmjs.com/package/${item.name}`,fetchUrl:url,httpStatus:result.status,
      canonicalName:data.name||item.name,version:data.version||null,description:clean(data.description),keywords:Array.isArray(data.keywords)?data.keywords.map(clean).filter(Boolean):[],
      homepage:clean(data.homepage),repository:repositoryUrl(data.repository),license:clean(data.license)};
  }
  if(item.ecosystem==='Python'){
    const url=pypiUrl(item.name);
    const result=await requestJson(url);
    if(!result.data)return {...item,registry:'PyPI',registryUrl:`https://pypi.org/project/${item.name}/`,fetchUrl:url,httpStatus:result.status,error:result.error||null};
    const info=result.data.info||{};
    return {...item,registry:'PyPI',registryUrl:info.package_url||`https://pypi.org/project/${item.name}/`,fetchUrl:url,httpStatus:result.status,
      canonicalName:info.name||item.name,version:info.version||null,description:clean(info.summary),keywords:clean(info.keywords).split(/[,;]\s*|\s{2,}/).filter(Boolean),
      homepage:clean(info.home_page),repository:clean(info.project_urls?.Source||info.project_urls?.Repository||info.project_urls?.Homepage),license:clean(info.license_expression||info.license)};
  }
  let lastResult={status:404};
  for(const formula of brewNames(item.name)){
    const url=`https://formulae.brew.sh/api/formula/${encodeURIComponent(formula)}.json`;
    const result=await requestJson(url);
    lastResult=result;
    if(!result.data)continue;
    const data=result.data;
    return {...item,registry:'Homebrew',registryUrl:`https://formulae.brew.sh/formula/${formula}`,fetchUrl:url,httpStatus:result.status,
      canonicalName:data.name||item.name,version:data.versions?.stable||null,description:clean(data.desc),keywords:[],homepage:clean(data.homepage),repository:'',license:clean(data.license)};
  }
  return {...item,registry:'Homebrew',registryUrl:'https://formulae.brew.sh/',httpStatus:lastResult.status,error:lastResult.status===404?'formula not found':lastResult.error||'formula lookup failed'};
}

const retryFailed=process.argv.includes('--retry-failed');
const reusable=item=>Boolean(item)&&(!retryFailed||item.httpStatus===200||item.httpStatus===404);
const results=Object.fromEntries([...packages.keys()].filter(key=>previous.packages[key]).map(key=>[key,previous.packages[key]]));
const queue=[...packages.values()].filter(item=>!reusable(results[item.key]));
const cacheMatches=Object.keys(previous.packages).length===packages.size&&queue.length===0;
let cursor=0;
let completed=0;
const startedAt=new Date().toISOString();

async function save(){
  const values=Object.values(results);
  const payload={
    version:1,
    startedAt:previous.startedAt||startedAt,
    updatedAt:new Date().toISOString(),
    definition:'Official registry metadata cache. Descriptions are source evidence; they do not by themselves confirm a V1 scenario assignment or HarmonyOS compatibility.',
    requested:packages.size,
    resolved:values.filter(item=>item.httpStatus===200&&item.description).length,
    missingDescription:values.filter(item=>item.httpStatus===200&&!item.description).length,
    notFound:values.filter(item=>item.httpStatus===404).length,
    failed:values.filter(item=>!item.httpStatus||item.httpStatus>=400&&item.httpStatus!==404).length,
    packages:results
  };
  await fs.writeFile(outputFile,JSON.stringify(payload,null,2));
}

async function worker(){
  while(cursor<queue.length){
    const item=queue[cursor++];
    results[item.key]=await fetchMetadata(item);
    completed+=1;
    if(completed%200===0){
      await save();
      console.log(`${completed}/${queue.length}`);
    }
  }
}

console.log(`Metadata targets: ${packages.size}; cached: ${packages.size-queue.length}; fetching: ${queue.length}`);
if(!cacheMatches){
  await Promise.all(Array.from({length:Math.min(20,queue.length||1)},worker));
  await save();
}
const final=cacheMatches?previous:JSON.parse(await fs.readFile(outputFile,'utf8'));
console.log(JSON.stringify({requested:final.requested,resolved:final.resolved,missingDescription:final.missingDescription,notFound:final.notFound,failed:final.failed},null,2));
