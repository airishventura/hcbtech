import { createServer } from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import path from 'node:path';
const args=process.argv.slice(2);const value=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const port=Number(value('--port','4173'));const host=value('--host','127.0.0.1');
const {paths,variantPages}=JSON.parse(await readFile('dist/route-manifest.json','utf8'));const root=path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpeg':'image/jpeg','.jpg':'image/jpeg','.glb':'model/gltf-binary','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain','.json':'application/json'};
const server=createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://local');let pathname=decodeURIComponent(url.pathname);if(pathname.length>1)pathname=pathname.replace(/\/$/,'');
  const language=url.searchParams.get('lang')==='en'?'en':'id';let status=200;let file;
  const selected=variantPages.find(item=>item.path===pathname&&item.variant===url.searchParams.get("varian"));
  if(selected)file=`__variants/${language}/${pathname.slice(1)}/${selected.variant}.html`;
  else if(paths.includes(pathname))file=`__pages/${language}/${pathname==='/'?'home':pathname.slice(1)}.html`;
  else { const candidate=path.resolve(root,'.'+pathname);if(candidate.startsWith(root+path.sep)&&!pathname.startsWith('/__pages/')&&!pathname.startsWith('/__variants/')&&(await stat(candidate).catch(()=>null))?.isFile())file=path.relative(root,candidate);else {status=404;file=`__pages/${language}/404.html`;} }
  const body=await readFile(path.join(root,file));res.writeHead(status,{'content-type':mime[path.extname(file)]??'application/octet-stream','cache-control':'no-cache'});res.end(req.method==='HEAD'?undefined:body);
 }catch {res.writeHead(400);res.end('Bad request');}
});server.listen(port,host,()=>console.log(`Prerendered preview http://${host}:${port}`));
