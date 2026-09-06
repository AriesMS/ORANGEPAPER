import {createServer} from 'node:http';
import {readFile,appendFile,mkdir} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
const root=resolve('dist'),port=Number(process.env.PORT||4173);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2'};
await mkdir('logs',{recursive:true});
const log=(file,message)=>appendFile(`logs/${file}.log`,`${new Date().toISOString()} ${message}\n`).catch(console.error);
const server=createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
    const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);
    await log('access',`${req.method} ${pathname.replace(/[\r\n]/g,'')} 200`);
  }catch(error){res.writeHead(error.code==='ENOENT'?404:500);res.end('File unavailable');await log('error',error.message);}
});
server.on('error',async error=>{await log('error',error.message);console.error(error);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}`));
