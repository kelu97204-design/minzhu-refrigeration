import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {pages} from '../.prerender/prerender.js';
const template=await readFile('dist/client/index.html','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const p of pages){const dir=`dist/client/products/${p.slug}`;await mkdir(dir,{recursive:true});const html=template.replace(/<title>.*?<\/title>/,`<title>${escape(p.title)}</title>`).replace(/(<meta name="description" content=")[^"]*/,`$1${escape(p.description)}`).replace('<div id="root"></div>',`<div id="root">${p.html}</div>`);await writeFile(`${dir}/index.html`,html)}
await rm('.prerender',{recursive:true,force:true});
console.log(`Prerendered ${pages.length} product pages.`);
