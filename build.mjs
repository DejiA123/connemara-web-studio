#!/usr/bin/env node
// Build everything into dist/.  Usage:
//   node build.mjs            build studio site, demos and every client not marked "draft"
//   node build.mjs --drafts   also build drafts (for previewing a sample before you publish it)
//   node build.mjs --serve    build, then serve dist/ on http://localhost:8080
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { renderClient, renderClientPrivacy, T } from './src/client-site.mjs';
import { renderStudio, renderStudioPrivacy } from './src/studio-site.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const args = new Set(process.argv.slice(2));
const warnings = [];

const readJSON = (f) => {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { console.error(`\n✖ ${path.relative(ROOT, f)} is not valid JSON:\n  ${e.message}\n`); process.exit(1); }
};
const write = (rel, html) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };

// any value still starting with "TODO" is treated as empty, and reported
function clean(obj, where) {
  if (typeof obj === 'string') { if (obj.startsWith('TODO')) { warnings.push(`${where}: ${obj}`); return ''; } return obj; }
  if (Array.isArray(obj)) return obj.map((v, i) => clean(v, `${where}[${i}]`));
  if (obj && typeof obj === 'object') return Object.fromEntries(Object.entries(obj).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, clean(v, `${where}.${k}`)]));
  return obj;
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
if (fs.existsSync(path.join(ROOT, 'clients/photos'))) fs.cpSync(path.join(ROOT, 'clients/photos'), path.join(DIST, 'photos'), { recursive: true });

const studio = clean(readJSON(path.join(ROOT, 'studio.json')), 'studio.json');

// ---- clients (demos, samples, live client sites) ----
const clientDir = path.join(ROOT, 'clients');
const files = fs.readdirSync(clientDir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort();
const demos = [];
const built = [];
for (const f of files) {
  const raw = readJSON(path.join(clientDir, f));
  if (raw.draft && !args.has('--drafts')) { built.push({ f, skipped: 'draft' }); continue; }
  const site = clean(raw, `clients/${f}`);
  site.slug ||= f.replace(/\.json$/, '');
  const base = site.demo ? `demos/${site.slug}/` : `sites/${site.slug}/`;
  const depth = base.split('/').filter(Boolean).length;
  const rel = '../'.repeat(depth);
  write(base + 'index.html', renderClient(site, 'en', { rel, studio }));
  if ((site.languages || []).includes('ga')) write(base + 'ga/index.html', renderClient(site, 'ga', { rel: rel + '../', studio }));
  write(base + 'privacy.html', renderClientPrivacy(site, { rel }));
  built.push({ f, url: base });
  if (site.demo) demos.push({ path: base, name: site.name, theme: site.theme || 'atlantic', bilingual: (site.languages || []).includes('ga'), kind: site.demoKind?.en || site.type, kindGa: site.demoKind?.ga || site.type, blurb: { en: T(site.demoBlurb, 'en'), ga: T(site.demoBlurb, 'ga') } });
}
const order = { bnb: 0, cafe: 1, trades: 2 };
demos.sort((a, b) => (order[a.kind] ?? 0) - (order[b.kind] ?? 0));

// ---- studio site ----
write('index.html', renderStudio(studio, 'en', { rel: '', demos }));
write('ga/index.html', renderStudio(studio, 'ga', { rel: '../', demos }));
write('privacy.html', renderStudioPrivacy(studio));
write('404.html', `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not found</title><link rel="stylesheet" href="${studio.siteUrl ? new URL('assets/studio.css', studio.siteUrl).pathname : '/assets/studio.css'}"><main class="sec"><div class="wrap narrow"><h1>Page not found</h1><p><a href="${studio.siteUrl || '/'}">Back to ${studio.studioName}</a></p></div></main>`);
const site = (studio.siteUrl || '').replace(/\/?$/, '/');
write('robots.txt', `User-agent: *\nDisallow: /sites/\nDisallow: /demos/\n${site.startsWith('http') ? `Sitemap: ${site}sitemap.xml\n` : ''}`);
if (site.startsWith('http')) write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}</loc></url><url><loc>${site}ga/</loc></url></urlset>\n`);

// ---- report ----
console.log('\n✔ Built into dist/\n');
console.log('  Your site     index.html  (Irish: ga/)');
for (const b of built) console.log(b.skipped ? `  · skipped     clients/${b.f} (draft: set "draft": false to publish)` : `  ✔ ${b.url.padEnd(34)} from clients/${b.f}`);
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} TODO value(s) still to fill in (left blank on the site for now):`);
  for (const w of [...new Set(warnings)].slice(0, 30)) console.log('  - ' + w);
}
console.log('');

if (args.has('--serve')) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.txt': 'text/plain', '.xml': 'application/xml' };
  http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let f = path.join(DIST, p);
    if (!f.startsWith(DIST)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(8080, () => console.log('Serving on http://localhost:8080  (Ctrl+C to stop)'));
}
