// Optional PNG export. Pass the installed sharp module path as the first argument.
const fs=require('node:fs'),path=require('node:path');
const sharp=require(process.argv[2]||'sharp');
(async()=>{
 const dir=path.join(__dirname,'rank-trends');
 const files=fs.readdirSync(dir).filter(n=>n.endsWith('.svg'));
 for(const file of files)await sharp(path.join(dir,file),{density:144}).png().toFile(path.join(dir,file.replace(/\.svg$/,'.png')));
 console.log(`Rendered ${files.length} PNG charts`);
})().catch(e=>{console.error(e);process.exitCode=1;});
