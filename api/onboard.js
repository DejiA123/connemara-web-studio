// The "2-minute setup" for an owner's card payments (Stripe Connect Express).
//
//   You:   /api/onboard?slug=clifden-farmhouse&key=<ONBOARD_KEY>
//          → a page with the owner's personal setup link, their status, and "Send by WhatsApp".
//   Owner: /api/onboard?slug=clifden-farmhouse&t=<token>   (the link you send them)
//          → straight into Stripe's secure form, with the B&B's details already filled in.
//          They add: the code Stripe texts to their mobile, date of birth, address, IBAN (and a photo of ID if asked).
//   After: /api/onboard?slug=clifden-farmhouse&done=1 → "You're all set".
// Card payments then switch on by themselves on the owner's site (api/_lib.js finds their account).
//
// Vercel env: STRIPE_PLATFORM_KEY (your studio Stripe secret key, Connect enabled), ONBOARD_KEY (any long password you choose).
const crypto = require('crypto');
const { studio, SITES, connectedAccount, platformKey, stripePost } = require('./_lib');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const token = (slug) => crypto.createHmac('sha256', process.env.ONBOARD_KEY || '').update('onboard:' + slug).digest('hex').slice(0, 24);
const same = (a, b) => { a = Buffer.from(String(a || '')); b = Buffer.from(String(b || '')); return a.length === b.length && crypto.timingSafeEqual(a, b); };
const telIntl = (p) => { const d = String(p || '').replace(/[^\d+]/g, ''); return d.startsWith('0') ? '+353' + d.slice(1) : d; };

function page(res, code, title, body) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title>
<style>*{box-sizing:border-box}body{margin:0;font:17px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#faf6ee;color:#2a2620}main{max-width:560px;margin:0 auto;padding:40px 20px}
h1{font:600 1.9rem/1.2 Georgia,serif;color:#36543b;margin:0 0 14px}.card{background:#fff;border:1px solid #e4dccb;border-radius:10px;padding:18px;margin:18px 0}
.btn{display:block;text-align:center;background:#36543b;color:#fff;text-decoration:none;font-weight:700;padding:15px;border-radius:8px;margin:10px 0;border:0;width:100%;font-size:1rem;cursor:pointer}
.btn.wa{background:#1f8f4e}.btn.ghost{background:#fff;color:#36543b;border:2px solid #36543b}code{word-break:break-all;background:#f3efe6;padding:2px 6px;border-radius:4px;font-size:.9rem}
.ok{color:#1d6b3b;font-weight:700}.wait{color:#9a6a10;font-weight:700}ol{padding-left:22px}small{color:#6d6458}</style></head><body><main>${body}</main></body></html>`);
}

module.exports = async (req, res) => {
  const q = req.query || {};
  const slug = String(q.slug || '');
  const site = SITES[slug];
  if (!site) return page(res, 404, 'Not found', '<h1>Not found</h1>');
  const host = req.headers && req.headers.host ? `https://${req.headers.host}` : (studio.siteUrl || '').replace(/\/$/, '');
  const self = `${host}/api/onboard?slug=${encodeURIComponent(slug)}`;
  const who = site.host || 'there';
  if (!platformKey() || !process.env.ONBOARD_KEY) return page(res, 503, 'Not switched on', '<h1>Not switched on yet</h1><p>Add <code>STRIPE_PLATFORM_KEY</code> and <code>ONBOARD_KEY</code> in Vercel first (see docs/card-payments-setup.md).</p>');

  try {
    // ---- the owner comes back from Stripe ----
    if (q.done) {
      const acct = await connectedAccount(slug, true);
      const on = acct && acct.charges_enabled;
      return page(res, 200, 'All set', `<h1>${on ? `Thank you, ${esc(who)}! You’re all set.` : `Thank you, ${esc(who)}!`}</h1>
        <div class="card">${on
          ? `<p class="ok">✓ Card payments are now switched on on your website.</p><p>When a guest pays, the money goes into your bank account by itself. There’s nothing else you need to do.</p>`
          : `<p class="wait">Stripe is checking your details. This usually takes a few minutes.</p><p>There’s nothing else you need to do. If Stripe needs anything more, they’ll email you.</p>`}</div>
        <a class="btn ghost" href="${esc((studio.siteUrl || '/').replace(/\/?$/, '/'))}sites/${esc(slug)}/">See your website</a>`);
    }

    // ---- the owner taps their link: create their account (first time) and send them to Stripe's form ----
    if (q.t) {
      if (!same(q.t, token(slug))) return page(res, 403, 'Link not valid', '<h1>This link isn’t valid</h1><p>Please ask for a new one.</p>');
      let acct = await connectedAccount(slug, true);
      if (!acct) {
        const f = new URLSearchParams({
          type: 'express', country: 'IE', business_type: 'individual',
          'capabilities[card_payments][requested]': 'true', 'capabilities[transfers][requested]': 'true',
          'business_profile[name]': site.name,
          'business_profile[url]': `${(studio.siteUrl || host).replace(/\/?$/, '/')}sites/${slug}/`,
          'business_profile[mcc]': '7011',
          'business_profile[product_description]': `Bed and breakfast accommodation${site.area ? ' in ' + site.area : ''}, booked on our own website.`,
          'settings[payments][statement_descriptor]': site.name.toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 22),
          'metadata[slug]': slug,
        });
        if (site.phone) f.set('business_profile[support_phone]', telIntl(site.phone));
        if (site.email) f.set('email', site.email);
        const r = await stripePost('accounts', platformKey(), f);
        acct = await r.json();
        if (!r.ok) throw new Error((acct.error || {}).message || 'account');
      }
      const r2 = await stripePost('account_links', platformKey(), new URLSearchParams({
        account: acct.id, type: 'account_onboarding',
        'collection_options[fields]': 'currently_due', // only what Stripe needs today: shortest possible form
        refresh_url: `${self}&t=${encodeURIComponent(q.t)}`,
        return_url: `${self}&done=1`,
      }));
      const link = await r2.json();
      if (!r2.ok || !link.url) throw new Error((link.error || {}).message || 'link');
      res.statusCode = 302; res.setHeader('Location', link.url); res.setHeader('Cache-Control', 'no-store');
      return res.end();
    }

    // ---- your page: the owner's link + status ----
    if (!same(q.key, process.env.ONBOARD_KEY)) return page(res, 403, 'Private', '<h1>Private page</h1>');
    const acct = await connectedAccount(slug, true);
    const marysLink = `${self}&t=${token(slug)}`;
    const status = !acct ? 'Not started yet' : acct.charges_enabled ? '<span class="ok">✓ Card payments ON</span>' : acct.details_submitted ? '<span class="wait">Details sent, Stripe is checking</span>' : '<span class="wait">Started, not finished</span>';
    const msg = `Hi ${who}, here's the 2-minute setup so guests can pay you by card on your website. The money goes straight into your bank account: ${marysLink}`;
    return page(res, 200, `Card payments: ${site.name}`, `<h1>Card payments for ${esc(site.name)}</h1>
      <div class="card"><b>Status:</b> ${status}${acct ? `<br><small>Stripe account ${esc(acct.id)}</small>` : ''}</div>
      <div class="card"><b>${esc(who)}’s personal setup link</b> (safe to send; it only sets up ${esc(site.name)}):<p><code>${esc(marysLink)}</code></p>
      <a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(msg)}">Send to ${esc(who)} by WhatsApp</a>
      <a class="btn" href="sms:?&body=${encodeURIComponent(msg)}">Send by text message</a>
      <a class="btn ghost" href="${esc(marysLink)}">Open it on this phone (hand it to ${esc(who)})</a></div>
      <div class="card"><b>What ${esc(who)} does (about 2 minutes):</b><ol><li>Taps the link. The B&amp;B details are already filled in.</li><li>Types the code Stripe texts to her mobile.</li><li>Date of birth, home address, bank IBAN.</li><li>Photo of passport or driving licence, only if Stripe asks.</li></ol><small>Then card payments switch on on the website by themselves. This page shows ✓ when they’re on.</small></div>`);
  } catch (e) {
    return page(res, 502, 'Problem', `<h1>Something went wrong</h1><p>Stripe said: ${esc(e.message)}</p><p>Please try again in a minute.</p>`);
  }
};
module.exports.token = token;
