// GET /api/calendar?slug=clifden-farmhouse&room=room1
// An iCal feed of the bookings PAID ON THE WEBSITE for one room.
// Paste this address into Airbnb ("Import calendar") and Booking.com ("Sync calendars"),
// so a website booking closes those nights there too. No names or personal details are included.
const { SITES, findRoom, websiteBookings, T } = require('./_lib');

module.exports = async (req, res) => {
  const q = req.query || {};
  const site = SITES[String(q.slug || '')];
  const found = site && findRoom(site, String(q.room || ''));
  if (!found) { res.statusCode = 404; return res.end('Not found'); }
  const web = await websiteBookings(q.slug).catch(() => ({ ok: false, list: [] }));
  const ymd = (s) => s.replace(/-/g, '');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const events = web.list.filter((b) => b.room === found.id && b.paid).map((b) => [
    'BEGIN:VEVENT',
    `UID:${b.id}@bookdirectconnemara`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(b.range[0])}`,
    `DTEND;VALUE=DATE:${ymd(b.range[1])}`,
    'SUMMARY:Booked on website',
    'END:VEVENT',
  ].join('\r\n'));
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Book Direct Connemara//EN', `X-WR-CALNAME:${site.name} - ${T(found.room.name, 'en')} (website)`, ...events, 'END:VCALENDAR', ''].join('\r\n');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300');
  res.end(body);
};
