// Turns the two call-sheet HTML files into one-page A4 PDFs.
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const f of ['call-cheat-sheet', 'call-cheat-sheet-1b', 'call-cheat-sheet-2', 'call-cheat-sheet-3']) {
    await p.goto('file://' + path.join(__dirname, '..', 'docs', f + '.html'));
    await p.emulateMedia({ media: 'print' });
    await p.pdf({ path: path.join(__dirname, '..', 'docs', f + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  }
  await b.close();
})();
