#!/usr/bin/env node
// Make a new free sample in seconds:
//   node new-sample.mjs "Ardmor Country House" --area "Spiddal, Co. Galway" --phone "091 553 145"
//   node new-sample.mjs "Rockfield House" --type cafe|trades|bnb --theme heather
// Then open clients/<slug>.json, fill in the TODO lines, and run: node build.mjs --serve
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const argv = process.argv.slice(2);
const name = argv.find((a) => !a.startsWith('--') && !argv[argv.indexOf(a) - 1]?.startsWith('--'));
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
if (!name) {
  console.log('Usage: node new-sample.mjs "Business Name" [--type bnb|cafe|trades] [--area "Spiddal, Co. Galway"] [--phone "091 ..."] [--theme atlantic|heather|bog|stone|turf]');
  process.exit(1);
}
const type = opt('type', 'bnb');
const slug = name.toLowerCase().replace(/b&b/g, 'bnb').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const tplFile = path.join(ROOT, 'clients', `_TEMPLATE-${type}.json`);
if (!fs.existsSync(tplFile)) { console.error(`No template for type "${type}". Use bnb, cafe or trades.`); process.exit(1); }
const out = path.join(ROOT, 'clients', `${slug}.json`);
if (fs.existsSync(out)) { console.error(`clients/${slug}.json already exists. Edit that one.`); process.exit(1); }

const site = JSON.parse(fs.readFileSync(tplFile, 'utf8'));
site.slug = slug;
site.name = name;
site.sample = true;
site.draft = false;
if (opt('area')) { site.area = opt('area'); site.mapQuery = `${name}, ${opt('area')}`; }
if (opt('phone')) site.phone = opt('phone');
if (opt('theme')) site.theme = opt('theme');
fs.writeFileSync(out, JSON.stringify(site, null, 2) + '\n');
console.log(`\n✔ Created clients/${slug}.json\n
Next:
  1. Open clients/${slug}.json and replace every "TODO" (rooms, prices, about text).
     Facts come from their Booking.com / Google listing. Put real photos in
     clients/photos/${slug}/ and list them under "photos" (or leave the illustrations).
  2. node build.mjs --serve      → check http://localhost:8080/sites/${slug}/ on your phone size
  3. git add -A && git commit -m "Sample: ${name}" && git push
     → live in ~1 minute at <your site>/sites/${slug}/
`);
