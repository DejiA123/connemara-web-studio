// Builds the link-preview image (assets/img/share.jpg, 1200x630) and phone home-screen icon (assets/icon-180.png).
const path = require('path');
const { chromium } = require('playwright');
const root = path.join(__dirname, '..');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const bg = 'data:image/jpeg;base64,' + require('fs').readFileSync(path.join(root, 'assets/img/roundstone-golden.jpg')).toString('base64');
  await p.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,650&family=Inter:wght@500;600&display=swap" rel="stylesheet"></head>
  <body style="margin:0;width:1200px;height:630px;position:relative;font-family:Inter,Arial,sans-serif;overflow:hidden">
  <img src="${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 60%">
  <div style="position:absolute;inset:0;background:linear-gradient(100deg,rgba(8,26,38,.92) 0%,rgba(8,26,38,.7) 50%,rgba(8,26,38,.15) 100%)"></div>
  <div style="position:absolute;left:70px;top:70px;right:300px;color:#fff">
    <div style="font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:#f3c25e;font-weight:600">Book Direct Connemara</div>
    <div style="font-family:Fraunces,Georgia,serif;font-weight:650;font-size:66px;line-height:1.06;margin-top:26px">Websites that take bookings, for Connemara B&amp;Bs</div>
    <div style="font-size:28px;margin-top:28px;color:rgba(255,255,255,.9)">Free sample first · Irish &amp; English · Local</div>
  </div></body></html>`, { waitUntil: 'networkidle' }).catch(() => {});
  await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(root, 'assets/img/share.jpg'), type: 'jpeg', quality: 85 });
  const q = await b.newPage({ viewport: { width: 180, height: 180 } });
  await q.setContent(`<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0c2533"/><path d="M5 22l6-8 4 5 3-3 9 6z" fill="#fff"/><circle cx="23" cy="10" r="3" fill="#f3c25e"/><path d="M4 25.5c2 0 2-1.2 4-1.2s2 1.2 4 1.2 2-1.2 4-1.2 2 1.2 4 1.2 2-1.2 4-1.2 2 1.2 4 1.2" stroke="#2a7a98" stroke-width="1.2" fill="none"/></svg></body>`);
  await q.screenshot({ path: path.join(root, 'assets/icon-180.png') });
  await b.close();
})();
