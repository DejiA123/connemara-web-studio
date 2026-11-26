// GET /api/availability?slug=clifden-farmhouse
// → { live, rooms: { room1: [["2027-04-20","2027-04-23"], ...] }, updated }
// Each range is the booked nights: first night up to (not including) the check-out day.
// When a guest checks out, their nights are simply in the past, so the room shows free again.
const { SITES, availability, send } = require('./_lib');

module.exports = async (req, res) => {
  const slug = String((req.query || {}).slug || '');
  if (!SITES[slug]) return send(res, 404, { live: false, error: 'Unknown site' });
  try {
    const a = await availability(slug);
    if (!a.live) return send(res, 503, { live: false, error: 'Live availability is not switched on yet.' }, 'no-store');
    // cached at Vercel's edge for 2 minutes, so calendars are read at most every 2 minutes
    return send(res, 200, { live: true, rooms: a.rooms, updated: a.updated }, 'public, s-maxage=120, stale-while-revalidate=300');
  } catch {
    return send(res, 503, { live: false, error: 'Availability could not be read.' });
  }
};
