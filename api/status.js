// GET /api/status?slug=clifden-farmhouse → { card: true|false }
// The website asks this before showing the card button, so guests never see a card button that doesn't work yet.
const { SITES, stripeAuth, send } = require('./_lib');

module.exports = async (req, res) => {
  const slug = String((req.query || {}).slug || '');
  const site = SITES[slug];
  if (!site) return send(res, 404, { card: false });
  let card = false;
  if ((site.booking || {}).cardPayments) card = !!(await stripeAuth(slug).catch(() => null));
  return send(res, 200, { card }, 'public, s-maxage=60, stale-while-revalidate=300');
};
