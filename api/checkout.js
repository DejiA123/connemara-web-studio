// Card payments for a client's B&B site (Vercel serverless function).
//
// The browser sends: { slug, room, arrive, depart, guests, lang }.
// The price is worked out HERE from the client's JSON file (never trusted from the browser),
// then we create a Stripe Checkout page in the CLIENT'S OWN Stripe account and send the guest there.
// The money goes straight to the client's bank account; Stripe emails them each payment.
//
// Setup per client (see docs/card-payments-setup.md):
//   1. The client has their own Stripe account (identity + bank details, once).
//   2. In Vercel > Settings > Environment Variables add  STRIPE_KEY_<SLUG>  (e.g. STRIPE_KEY_CLIFDEN_FARMHOUSE)
//      = a restricted key from their Stripe account with "Checkout Sessions: Write".
//   3. In the client JSON set  "booking": { "cardPayments": true }  and remove "sample".

const studio = require('../studio.json');
// Add each client that takes card payments here (static require so Vercel bundles the file).
const SITES = {
  'clifden-farmhouse': require('../clients/clifden-farmhouse.json'),
};

const T = (v, lang) => (v && typeof v === 'object' ? v[lang] || v.en || '' : v || '');
const euros = (p) => { const m = String(p || '').replace(',', '').match(/(\d+(?:\.\d+)?)/); return m ? Number(m[1]) : 0; };
const isoOk = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !isNaN(new Date(s + 'T12:00:00Z'));

// Same rule as the site: add up night by night; months in highMonths use priceHigh.
function quote(room, arrive, depart) {
  const a = new Date(arrive + 'T12:00:00Z'), d = new Date(depart + 'T12:00:00Z');
  const nights = Math.round((d - a) / 864e5);
  const low = euros(room.price), high = euros(room.priceHigh), hi = room.highMonths || [];
  let total = 0;
  for (let k = 0, x = new Date(a); k < nights; k++, x.setUTCDate(x.getUTCDate() + 1)) total += high && hi.includes(x.getUTCMonth() + 1) ? high : low;
  return { nights, total };
}

module.exports = async (req, res) => {
  const send = (code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(obj)); };
  if (req.method !== 'POST') return send(405, { error: 'POST only' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};

  const site = SITES[b.slug];
  if (!site || !(site.booking || {}).cardPayments) return send(404, { error: 'Card payments are not set up for this site.' });
  const key = process.env['STRIPE_KEY_' + String(b.slug).toUpperCase().replace(/[^A-Z0-9]/g, '_')];
  if (!key) return send(503, { error: 'Card payments are not switched on yet.' });

  const room = (site.rooms || []).find((r) => T(r.name, 'en') === b.room);
  if (!room || !euros(room.price)) return send(400, { error: 'Please choose a room.' });
  if (!isoOk(b.arrive) || !isoOk(b.depart)) return send(400, { error: 'Please choose your dates.' });
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (new Date(b.arrive + 'T12:00:00Z') < today) return send(400, { error: 'Your arrival date is in the past.' });
  const { nights, total } = quote(room, b.arrive, b.depart);
  if (nights < 1 || nights > 30) return send(400, { error: 'Please check your dates (1 to 30 nights).' });
  const guests = Math.max(1, Math.min(8, parseInt(b.guests, 10) || 2));
  const lang = b.lang === 'ga' ? 'ga' : 'en';

  const base = (studio.siteUrl || '').replace(/\/?$/, '/') + `sites/${b.slug}/` + (lang === 'ga' ? 'ga/' : '');
  const fmt = (s) => new Date(s + 'T12:00:00Z').toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const what = `${T(room.name, 'en')}: ${fmt(b.arrive)} to ${fmt(b.depart)} (${nights} night${nights === 1 ? '' : 's'}, ${guests} guest${guests === 1 ? '' : 's'})`;

  const form = new URLSearchParams({
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': String(Math.round(total * 100)),
    'line_items[0][price_data][product_data][name]': `${site.name}: ${T(room.name, 'en')}`,
    'line_items[0][price_data][product_data][description]': what,
    'phone_number_collection[enabled]': 'true',
    'payment_intent_data[description]': `${site.name}: ${what}`,
    'metadata[room]': T(room.name, 'en'),
    'metadata[arrive]': b.arrive,
    'metadata[depart]': b.depart,
    'metadata[nights]': String(nights),
    'metadata[guests]': String(guests),
    'payment_intent_data[metadata][room]': T(room.name, 'en'),
    'payment_intent_data[metadata][arrive]': b.arrive,
    'payment_intent_data[metadata][depart]': b.depart,
    'payment_intent_data[metadata][guests]': String(guests),
    locale: 'auto',
    success_url: base + '?paid=1#book',
    cancel_url: base + '#book',
  });

  try {
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    const j = await r.json();
    if (!r.ok || !j.url) return send(502, { error: 'The card payment page could not be opened. Please ring to book.' });
    return send(200, { url: j.url, total, nights });
  } catch (e) {
    return send(502, { error: 'The card payment page could not be opened. Please ring to book.' });
  }
};

module.exports.quote = quote;
