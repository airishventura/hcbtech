import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseCatalogRevision } from '../src/lib/catalog-editing.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const file = args.find(arg => !arg.startsWith('--'));
if (!file || args.some(arg => arg.startsWith('--') && !['--check', '--apply'].includes(arg)) || (args.includes('--check') && args.includes('--apply'))) {
  console.error('Usage: npm run catalog:import -- revision.json [--check | --apply]'); process.exit(1);
}
try {
  const raw = await readFile(file, 'utf8');
  if (Buffer.byteLength(raw) > 256000) throw new Error('File exceeds 256 KB');
  const revision = parseCatalogRevision(JSON.parse(raw));
  console.log(`Validated: ${revision.products.length} families, ${revision.products.reduce((n,p) => n + p.variants.length, 0)} variants`);
  console.log(`Review: ${revision.review.by} / ${revision.review.date} / ${revision.review.source}`);
  for (const product of revision.products) for (const variant of product.variants) console.log(`${product.id} / ${variant.id}: IDR ${variant.priceIDR ?? 'pending'} / ${variant.priceKind} / ${variant.availability}`);
  if (!args.includes('--apply')) { console.log('Check only. No files changed. Review the JSON before applying.'); process.exit(0); }
  const body = JSON.stringify(revision, null, 2) + '\n';
  // The input cannot choose output paths; only these catalog content files change.
  const targets = ['assets/catalog-content.json', 'public/docs/catalog-update.json'].map(target => root + target);
  for (const path of targets) await writeFile(path + '.tmp', body);
  for (const path of targets) await rename(path + '.tmp', path);
  console.log('Applied locally. Review git diff, run npm run check, then publish the reviewed commit to Vercel.');
} catch (error) { console.error(error.message); process.exit(1); }
