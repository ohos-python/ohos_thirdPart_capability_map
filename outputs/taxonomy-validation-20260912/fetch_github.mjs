import fs from 'node:fs/promises';
const out = new URL('.', import.meta.url);
const queries = [
 ['global','stars:>=10000 fork:false archived:false'],
 ['01','logging in:name,description stars:>=5000 fork:false archived:false'],
 ['02','runtime in:name,description stars:>=5000 fork:false archived:false'],
 ['03','http in:name,description stars:>=5000 fork:false archived:false'],
 ['04','security in:name,description stars:>=5000 fork:false archived:false'],
 ['05','database in:name,description stars:>=5000 fork:false archived:false'],
 ['06','backend in:name,description stars:>=5000 fork:false archived:false'],
 ['07','UI in:name,description stars:>=5000 fork:false archived:false'],
 ['08','dataframe in:name,description stars:>=5000 fork:false archived:false'],
 ['09','multimedia in:name,description stars:>=5000 fork:false archived:false'],
 ['10','PDF in:name,description stars:>=5000 fork:false archived:false'],
 ['12','automation in:name,description stars:>=5000 fork:false archived:false'],
 ['11','machine learning in:name,description stars:>=5000 fork:false archived:false'],
 ['13','agent in:name,description stars:>=5000 fork:false archived:false'],
 ['14','compiler in:name,description stars:>=5000 fork:false archived:false'],
 ['15','monitoring in:name,description stars:>=5000 fork:false archived:false'],
];
const start = Number(process.argv[2] || 0), end = Number(process.argv[3] || queries.length);
for (const [key,q] of queries.slice(start,end)) {
 const url = 'https://api.github.com/search/repositories?q='+encodeURIComponent(q)+'&sort=stars&order=desc&per_page='+(key==='global'?100:5);
 const response = await fetch(url,{headers:{'User-Agent':'ohos-capability-taxonomy-audit','Accept':'application/vnd.github+json'}});
 const body=await response.json();
 const result={query:q,url,fetchedAt:new Date().toISOString(),status:response.status,...body};
 await fs.writeFile(new URL('github-'+key+'.json',out),JSON.stringify(result,null,2));
 console.log(key,response.status,body.total_count,body.items?.map(r=>r.full_name+' '+r.stargazers_count).join('; ')||body.message);
 if (!response.ok) break;
}
