import http from 'node:http';
import {stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(process.env.COOLMEKE_PREVIEW_ROOT||fileURLToPath(new URL('../dist/client/',import.meta.url)));
const port=Number(process.env.COOLMEKE_PREVIEW_PORT||4784);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.json':'application/json','.mp4':'video/mp4','.glb':'model/gltf-binary'};
http.createServer(async(req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end();return}
 const file=(await stat(target)).isFile()?target:path.join(target,'index.html');const info=await stat(file);
 const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
 let start=0,end=info.size-1,status=200;
 if(req.headers.range){const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
  if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return}
  start=m[1]?Number(m[1]):Math.max(0,info.size-Number(m[2]));end=m[1]&&m[2]?Math.min(Number(m[2]),end):end;
  if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return}
  status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
 }
 headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);
 if(req.method==='HEAD'||info.size===0){res.end();return}
 const stream=createReadStream(file,{start,end});stream.on('error',()=>res.destroy());stream.pipe(res);res.on('close',()=>stream.destroy());
}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`COOLMEKE preview: http://127.0.0.1:${port}/`));
