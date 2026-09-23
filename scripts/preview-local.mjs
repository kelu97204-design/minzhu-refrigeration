import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../dist/client/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.json':'application/json'};
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end();return}const file=(await stat(target)).isFile()?target:path.join(target,'index.html');res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found');}}).listen(4784,'127.0.0.1',()=>console.log('Minyou preview: http://127.0.0.1:4784/'));
