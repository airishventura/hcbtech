import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { render, paths, variantPages } from '../.prerender/entry-server.js';
const revision = JSON.parse(await readFile('assets/catalog-content.json', 'utf8'));
if (revision.products.length && !isDeepStrictEqual(revision, JSON.parse(await readFile('public/docs/catalog-update.json', 'utf8')))) throw new Error('Catalog content and its public source copy differ. Reapply the reviewed catalog revision.');
const template = await readFile('dist/index.html','utf8');
// Replace only managed SEO fields; keep Vite's hashed JS/CSS asset references.
const shell = template.replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<meta (?:name="(?:description|robots)"|property="og:[^"]+")[^>]*>/g,'').replace(/<script id="organization-jsonld"[\s\S]*?<\/script>/g,'').replace(/<noscript>[\s\S]*?<\/noscript>/g,'');
const entries=[...paths,'/404'].map(path=>({path,variant:null})).concat(variantPages);
for(const language of ['id','en']) for(const {path,variant} of entries) {
  const query=new URLSearchParams();if(language==='en')query.set('lang','en');if(variant)query.set('varian',variant);const url=path+(query.size?'?'+query:'');
  const result=await render(url);
  // Native links/disclosures work immediately; client-only controls enable at mount.
  const content=result.html.replace(/<(button|input|select|textarea)\b([^>]*)>/g,(match,tag,attrs)=>/\bdisabled(?:=|\s|$)/.test(attrs)?match:`<${tag} disabled=""${attrs}>`);
  const html=shell.replace('<html lang="id">',`<html lang="${language}">`).replace('</head>',result.head+'</head>').replace('<div id="root"></div>',`<div id="root" data-prerendered="true">${content}</div>`);
  const target=variant?`dist/__variants/${language}/${path.slice(1)}/${variant}.html`:`dist/__pages/${language}/${path==='/'?'home':path.slice(1)}.html`;
  await mkdir(target.slice(0,target.lastIndexOf('/')),{recursive:true});await writeFile(target,html);
  if(!variant&&path==='/404'&&language==='id')await writeFile('dist/404.html',html);
  if(!variant&&path==='/'&&language==='id')await writeFile('dist/index.html',html);
}
await writeFile('dist/route-manifest.json',JSON.stringify({paths,variantPages},null,2));
console.log(`Prerendered ${entries.length*2} HTML pages in Indonesian and English.`);
