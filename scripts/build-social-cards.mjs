// Run after npm run build, with the built preview server on SOCIAL_BASE_URL.
import { chromium } from '@playwright/test';
import { readFile,writeFile,mkdir,access } from 'node:fs/promises';
const base=process.env.SOCIAL_BASE_URL||'http://127.0.0.1:4176';
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || await access('/usr/bin/chromium').then(()=>'/usr/bin/chromium').catch(()=>undefined);
const browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
await mkdir('public/social',{recursive:true});await mkdir('dist/social',{recursive:true});
for(const language of ['id','en']) for(const slug of ['home','parut-kelapa','kupas-batok-kelapa','peras-santan']) {
 const file=`dist/__pages/${language}/${slug==='home'?'home':'mesin/'+slug}.html`;
 const html=await readFile(file,'utf8');const schema=JSON.parse(html.match(/<script id="page-jsonld"[^>]*>([\s\S]*?)<\/script>/)[1]);
 const image=slug==='home'?'/images/hero-shell-peeler.webp':new URL(schema.image[0]).pathname;
 const label=slug==='home'?(language==='en'?'Machinery illustration':'Ilustrasi mesin'):(language==='en'?'Machine-family reference photo':'Foto referensi keluarga mesin');
 const title=slug==='home'?(language==='en'?'Machines built for real work.':'Mesin yang dibuat untuk kerja nyata.'):schema.name;
 await page.setContent(`<html><head><style>@font-face{font-family:Space;src:url('${base}/fonts/space-grotesk.woff2')}*{box-sizing:border-box}body{margin:0;font-family:Space,sans-serif;background:#F2F0EB;color:#171717}.card{display:grid;grid-template-columns:54% 46%;height:630px;border-top:8px solid #C92525}.copy{padding:44px 48px;display:flex;flex-direction:column;align-items:start}.logo{width:200px;height:auto}h1{font-size:62px;line-height:1.04;letter-spacing:-3px;font-weight:500;margin:auto 0 32px;max-width:560px}p{font-size:21px;line-height:1.4;margin:0;color:#60676B}.foot{margin-top:auto;padding-top:28px;font-size:18px}.visual{position:relative;background:#DCDAD5;height:622px;overflow:hidden}.visual img{height:100%;width:100%;object-fit:contain}.tag{position:absolute;left:18px;right:18px;bottom:18px;padding:12px 14px;font-size:14px;background:#F2F0EBed;color:#171717}</style></head><body><div class=card><div class=copy><img class=logo src='${base}/brand/hcbtech-transparent.webp' alt='HCBTECH'><h1>${escape(title)}</h1><p>${language==='en'?'Explore photos, configurations and quotation requests.':'Lihat foto, pilihan konfigurasi, dan minta penawaran.'}</p><div class=foot>hcbtech.vercel.app</div></div><div class=visual><img src='${base+image}' alt=''><span class=tag>${label}</span></div></div></body></html>`);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
 const bytes=await page.screenshot({type:'png'});await writeFile(`public/social/${slug}-${language}.png`,bytes);await writeFile(`dist/social/${slug}-${language}.png`,bytes);
 console.log(slug,language,bytes.length);
}
await browser.close();
