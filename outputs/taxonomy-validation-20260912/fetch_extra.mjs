import fs from 'node:fs/promises';
const repos=['Delgan/loguru','gabime/spdlog','curl/curl','openssl/openssl','keycloak/keycloak','pandas-dev/pandas','pola-rs/polars','FFmpeg/FFmpeg','microsoft/playwright','asweigart/pyautogui','python-openxml/python-docx','langchain-ai/langgraph','spring-projects/spring-boot','fastapi/fastapi','llvm/llvm-project'];
const out=new URL('.',import.meta.url);
for(let i=0;i<repos.length;i+=3) await Promise.all(repos.slice(i,i+3).map(async repo=>{
 const r=await fetch('https://github.com/'+repo);const html=await r.text();
 await fs.writeFile(new URL('page-'+repo.replace('/','--')+'.html',out),html);
 const starTag=html.match(/<[^>]+id="repo-stars-counter-star"[^>]*>/)?.[0]||'';
 const stars=Number((starTag.match(/title="([\d,]+)"/)?.[1]||'').replaceAll(',',''))||null;
 const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'';
 const langs=[...html.matchAll(/<span class="color-fg-default text-bold mr-1">([^<]+)<\/span>/g)].map(m=>m[1]);
 const data={full_name:repo,html_url:r.url,status:r.status,stargazers_count:stars,description,language:langs[0]||null,languages:langs,fetchedAt:new Date().toISOString(),sourceMethod:'GitHub公开HTML精确title星数'};
 await fs.writeFile(new URL('extra-'+repo.replace('/','--')+'.json',out),JSON.stringify(data,null,2));
 console.log(repo,r.status,stars,langs.join(','),description.slice(0,100),stars?'':starTag);
}));
