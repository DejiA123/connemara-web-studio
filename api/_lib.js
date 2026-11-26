// Shared server code for client booking: prices, availability, Stripe.
// (Files starting with "_" in api/ are helpers, not web addresses.)
//
// Availability for a room = nights blocked on ANY of:
//   - the owner's Airbnb / Booking.com calendars (iCal export links, kept secret in Vercel env CAL_<SLUG>)
//   - bookings paid on the website (read back from the owner's Stripe account)
//   - someone paying right now (Stripe checkout open, held for 30 minutes)

const studio = require('../studio.json');
// Add each client that takes card payments / live availability here (static require so Vercel bundles the file).
const SITES = {
  'clifden-farmhouse': require('../clients/clifden-farmhouse.json'),
};

const T = (v, lang) => (v && typeof v === 'object' ? v[lang] || v.en || '' : v || '');
const euros = (p) => { const m = String(p || '').replace(',', '').match(/(\d+(?:\.\d+)?)/); return m ? Number(m[1]) : 0; };
const isoOk = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !isNaN(new Date(s + 'T12:00:00Z'));
const envName = (prefix, slug) => prefix + String(slug).toUpperCase().replace(/[^A-Z0-9]/g, '_');
const roomId = (r, i) => r.id || `room${i + 1}`;
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const todayIso = () => new Date().toISOString().slice(0, 10);

function findRoom(site, key) {
  const rooms = site.rooms || [];
  const i = rooms.findIndex((r, k) => roomId(r, k) === key || T(r.name, 'en') === key);
  return i < 0 ? null : { room: rooms[i], id: roomId(rooms[i], i) };
}

// Add up night by night; months in highMonths use priceHigh.
function quote(room, arrive, depart) {
  const a = new Date(arrive + 'T12:00:00Z'), d = new Date(depart + 'T12:00:00Z');
  const nights = Math.round((d - a) / 864e5);
  const low = euros(room.price), high = euros(room.priceHigh), hi = room.highMonths || [];
  let total = 0;
  for (let k = 0, x = new Date(a); k < nights; k++, x.setUTCDate(x.getUTCDate() + 1)) total += high && hi.includes(x.getUTCMonth() + 1) ? high : low;
  return { nights, total };
}

// iCal → [[firstNight, dayAfterLastNight], ...] (dates as YYYY-MM-DD)
function parseIcs(text) {
  const out = [];
  const lines = String(text || '').replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
  let s = null, e = null, inEv = false;
  const day = (v) => { const m = /(\d{4})(\d{2})(\d{2})/.exec(v || ''); return m ? `${m[1]}-${m[2]}-${m[3]}` : null; };
  for (const l of lines) {
    if (l.startsWith('BEGIN:VEVENT')) { inEv = true; s = e = null; }
    else if (l.startsWith('END:VEVENT')) { if (inEv && s) out.push([s, e && e > s ? e : addDays(s, 1)]); inEv = false; }
    else if (inEv && l.startsWith('DTSTART')) s = day(l.split(':').pop());
    else if (inEv && l.startsWith('DTEND')) e = day(l.split(':').pop());
  }
  return out;
}

function stripeKey(slug) { return process.env[envName('STRIPE_KEY_', slug)] || ''; }

// ---- Stripe Connect ("2-minute setup"): one Stripe account for the studio (the platform);
// each owner gets their own connected account by tapping a link (api/onboard.js). Their account is found by metadata.slug.
const platformKey = () => process.env.STRIPE_PLATFORM_KEY || '';
const stripeGet = (path, key) => fetch('https://api.stripe.com/v1/' + path, { headers: { Authorization: 'Bearer ' + key } });
const stripePost = (path, key, form) => fetch('https://api.stripe.com/v1/' + path, { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded' }, body: form });
const acctCache = {};
async function connectedAccount(slug, fresh) {
  const key = platformKey();
  if (!key) return null;
  const c = acctCache[slug];
  if (!fresh && c && Date.now() - c.at < 5 * 60e3) return c.acct;
  let after = '', found = null;
  for (let page = 0; page < 10 && !found; page++) {
    const r = await stripeGet('accounts?limit=100' + (after ? '&starting_after=' + after : ''), key);
    if (!r.ok) throw new Error('stripe ' + r.status);
    const j = await r.json();
    found = (j.data || []).find((a) => (a.metadata || {}).slug === slug) || null;
    if (!j.has_more || !(j.data || []).length) break;
    after = j.data[j.data.length - 1].id;
  }
  acctCache[slug] = { at: Date.now(), acct: found };
  return found;
}
// How to take payments for this client: their own key, or the studio platform key + their connected account.
async function stripeAuth(slug) {
  const own = stripeKey(slug);
  if (own) return { key: own, account: null };
  if (!platformKey()) return null;
  const acct = await connectedAccount(slug);
  if (!acct || !acct.charges_enabled) return null;
  return { key: platformKey(), account: acct.id };
}
function calendarSources(slug) {
  try { return JSON.parse(process.env[envName('CAL_', slug)] || '{}'); } catch { return {}; }
}

// Website bookings from the owner's Stripe account: paid ones, plus checkouts open in the last 35 minutes (hold).
async function websiteBookings(slug) {
  const auth = await stripeAuth(slug).catch(() => null);
  if (!auth) return { ok: false, list: [] };
  const key = auth.key, strict = !!auth.account; // platform key sees every client's sessions: only count this client's
  const list = [];
  let after = '';
  const since = Math.floor(Date.now() / 1000) - 400 * 86400;
  for (let page = 0; page < 5; page++) {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions?limit=100&created[gte]=${since}${after ? '&starting_after=' + after : ''}`, { headers: { Authorization: 'Bearer ' + key } });
    if (!r.ok) return { ok: false, list };
    const j = await r.json();
    for (const s of j.data || []) {
      const m = s.metadata || {};
      if ((m.slug || strict) && m.slug !== slug) continue;
      const paid = s.status === 'complete' && s.payment_status === 'paid';
      const holding = s.status === 'open' && Date.now() / 1000 - s.created < 35 * 60;
      if ((paid || holding) && m.room_id && isoOk(m.arrive) && isoOk(m.depart)) list.push({ room: m.room_id, range: [m.arrive, m.depart], paid, id: s.id });
    }
    if (!j.has_more || !(j.data || []).length) break;
    after = j.data[j.data.length - 1].id;
  }
  return { ok: true, list };
}

// { live, rooms: { roomId: [[start, end], ...] }, sources: {...} }
async function availability(slug) {
  const site = SITES[slug];
  const rooms = {};
  (site.rooms || []).forEach((r, i) => { rooms[roomId(r, i)] = []; });
  const cal = calendarSources(slug);
  const status = { calendars: 0, calendarErrors: 0, website: false };
  await Promise.all(Object.entries(cal).flatMap(([id, urls]) => [].concat(urls).map(async (u) => {
    if (!(id in rooms)) return;
    try {
      const r = await fetch(u, { headers: { 'User-Agent': 'BookDirectConnemara-calendar/1.0' } });
      if (!r.ok) throw new Error(r.status);
      rooms[id].push(...parseIcs(await r.text()));
      status.calendars++;
    } catch { status.calendarErrors++; }
  })));
  const web = await websiteBookings(slug).catch(() => ({ ok: false, list: [] }));
  status.website = web.ok;
  for (const b of web.list) if (b.room in rooms) rooms[b.room].push(b.range);
  // keep from today on, sorted
  const t = todayIso();
  for (const id in rooms) rooms[id] = rooms[id].filter((x) => x[1] > t).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  // live only if every calendar link worked (otherwise we might show a booked night as free)
  const live = status.calendars > 0 && status.calendarErrors === 0;
  return { live, rooms, status, updated: new Date().toISOString() };
}

const overlaps = (ranges, arrive, depart) => ranges.some(([s, e]) => s < depart && e > arrive);

function send(res, code, obj, cache) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', cache || 'no-store');
  res.end(JSON.stringify(obj));
}

module.exports = { studio, SITES, T, euros, isoOk, roomId, findRoom, quote, parseIcs, stripeKey, platformKey, connectedAccount, stripeAuth, stripeGet, stripePost, calendarSources, websiteBookings, availability, overlaps, send, addDays, todayIso };
