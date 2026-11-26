// POST /api/checkout  { slug, room, arrive, depart, guests, lang }
// Card payments for a client's B&B site (Vercel serverless function).
//
// The price is worked out HERE from the client's JSON file (never trusted from the browser).
// Just before payment we check the nights are still free (Airbnb / Booking.com calendars + website bookings),
// then create a Stripe Checkout page in the CLIENT'S OWN Stripe account. The nights are held for 30 minutes
// while the guest pays. The money goes straight to the client's bank account; Stripe emails them each payment.
// Setup: docs/card-payments-setup.md
const { studio, SITES, T, isoOk, findRoom, quote, stripeKey, availability, overlaps, send, todayIso } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  const ga = b.lang === 'ga';
  const say = (en, gaText) => (ga ? gaText : en);

  const site = SITES[b.slug];
  if (!site || !(site.booking || {}).cardPayments) return send(res, 404, { error: say('Card payments are not set up for this site.', 'Níl íocaíochtaí cárta socraithe don suíomh seo.') });
  const key = stripeKey(b.slug);
  if (!key) return send(res, 503, { error: say('Card payments are not switched on yet. Please ring to book.', 'Níl íocaíochtaí cárta ar siúl fós. Glaoigh chun áirithint a dhéanamh, le do thoil.') });

  const found = findRoom(site, String(b.room || ''));
  if (!found || !quote(found.room, '2030-01-01', '2030-01-02').total) return send(res, 400, { error: say('Please choose a room.', 'Roghnaigh seomra, le do thoil.') });
  const { room, id } = found;
  if (!isoOk(b.arrive) || !isoOk(b.depart)) return send(res, 400, { error: say('Please choose your dates.', 'Roghnaigh do dhátaí, le do thoil.') });
  if (b.arrive < todayIso()) return send(res, 400, { error: say('Your arrival date is in the past.', 'Tá do dháta teachta san am atá caite.') });
  const { nights, total } = quote(room, b.arrive, b.depart);
  if (nights < 1 || nights > 30) return send(res, 400, { error: say('Please check your dates (1 to 30 nights).', 'Seiceáil do dhátaí (1 go 30 oíche).') });
  const guests = Math.max(1, Math.min(8, parseInt(b.guests, 10) || 2));

  // are the nights still free?
  try {
    const a = await availability(b.slug);
    if (overlaps(a.rooms[id] || [], b.arrive, b.depart)) {
      return send(res, 409, { taken: true, error: say('Sorry, some of those nights have just been booked. Please choose other dates.', 'Ár leithscéal, tá cuid de na hoícheanta sin curtha in áirithe díreach anois. Roghnaigh dátaí eile, le do thoil.') });
    }
  } catch { /* calendars unreachable: the guest has rung the owner first (call-first flow), so carry on */ }

  const base = (studio.siteUrl || '').replace(/\/?$/, '/') + `sites/${b.slug}/` + (ga ? 'ga/' : '');
  const fmt = (s) => new Date(s + 'T12:00:00Z').toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const what = `${T(room.name, 'en')}: ${fmt(b.arrive)} to ${fmt(b.depart)} (${nights} night${nights === 1 ? '' : 's'}, ${guests} guest${guests === 1 ? '' : 's'})`;
  const meta = { slug: b.slug, room_id: id, room: T(room.name, 'en'), arrive: b.arrive, depart: b.depart, nights: String(nights), guests: String(guests) };

  const form = new URLSearchParams({
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': String(Math.round(total * 100)),
    'line_items[0][price_data][product_data][name]': `${site.name}: ${T(room.name, 'en')}`,
    'line_items[0][price_data][product_data][description]': what,
    'phone_number_collection[enabled]': 'true',
    'payment_intent_data[description]': `${site.name}: ${what}`,
    expires_at: String(Math.floor(Date.now() / 1000) + 31 * 60), // hold the nights for ~30 minutes
    locale: 'auto',
    success_url: base + '?paid=1#book',
    cancel_url: base + '#book',
  });
  for (const [k, v] of Object.entries(meta)) { form.set(`metadata[${k}]`, v); form.set(`payment_intent_data[metadata][${k}]`, v); }

  try {
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    const j = await r.json();
    if (!r.ok || !j.url) return send(res, 502, { error: say('The card payment page could not be opened. Please ring to book.', 'Níorbh fhéidir an leathanach íocaíochta a oscailt. Glaoigh chun áirithint a dhéanamh, le do thoil.') });
    return send(res, 200, { url: j.url, total, nights });
  } catch {
    return send(res, 502, { error: say('The card payment page could not be opened. Please ring to book.', 'Níorbh fhéidir an leathanach íocaíochta a oscailt. Glaoigh chun áirithint a dhéanamh, le do thoil.') });
  }
};

module.exports.quote = quote;
