// Renders one client website (B&B / café / trades) from a JSON file in clients/.
import { UI } from './i18n.mjs';
import { landscape, icon, THEMES } from './art.mjs';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
export const T = (v, lang) => (v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] ?? v.en ?? '') : (v ?? ''));
const has = (a) => Array.isArray(a) && a.length > 0;
const digits = (s) => String(s || '').replace(/[^\d]/g, '');

function priceNumber(p) {
  const m = String(p || '').replace(',', '').match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

export function renderClient(site, lang, ctx) {
  const L = UI[lang];
  const other = lang === 'en' ? 'ga' : 'en';
  const bilingual = (site.languages || ['en']).includes('ga');
  const theme = THEMES[site.theme] ? site.theme : 'atlantic';
  const th = THEMES[theme];
  const rel = ctx.rel; // path back to dist root
  const img = (src) => (/^(https?:)?\/\//.test(src) || src.startsWith('data:') ? src : rel + src);
  const isSample = !!(site.sample || site.demo);
  const type = site.type || 'bnb';
  const phone = site.phone || '';
  const wa = digits(site.whatsapp || '');
  const booking = site.booking || {};
  const nav = [];

  // ---------- sections ----------
  const S = [];

  // about
  const aboutParas = site.about ? [].concat(T(site.about, lang)).filter(Boolean) : [];
  if (aboutParas.length) {
    nav.push(['about', L.about]);
    const paras = aboutParas.map((p) => `<p>${esc(p)}</p>`).join('');
    S.push(`<section id="about" class="sec about"><div class="wrap two">
      <div><h2>${L.about}</h2>${paras}</div>
      <div class="about-art">${site.photos?.[1] ? `<img src="${esc(img(site.photos[1].src))}" alt="${esc(T(site.photos[1].alt, lang))}" loading="lazy">` : landscape(theme, 1)}</div>
    </div></section>`);
  }

  // highlights
  if (has(site.highlights)) {
    S.push(`<section class="sec highlights"><div class="wrap"><h2>${L.highlights}</h2><ul class="hl">${site.highlights
      .map((h) => `<li class="rv">${icon(h.icon || 'check', 26)}<span>${esc(T(h, lang))}</span></li>`).join('')}</ul></div></section>`);
  }

  // rooms
  if (has(site.rooms)) {
    nav.push(['rooms', L.rooms]);
    S.push(`<section id="rooms" class="sec rooms"><div class="wrap"><h2>${L.rooms}</h2><div class="cards">${site.rooms
      .map((r, i) => `<article class="card rv${r.photo ? '' : ' card-text'}">
        ${r.photo ? '' : `<div class="card-ic">${icon('bed', 26)}${r.price ? `<span class="ptag ptag-in"><small>${L.from}</small> ${esc(r.price)}<small>/${r.unit ? esc(T(r.unit, lang)).replace(/^(per|sa|san) /, '') : (lang === 'ga' ? 'oíche' : 'night')}</small></span>` : ''}</div>`}
        <div class="card-img"${r.photo ? '' : ' hidden'}>${r.photo ? `<img src="${esc(img(r.photo))}" alt="${esc(T(r.name, lang))}" loading="lazy">` : landscape(theme, i + 2)}${r.price ? `<span class="ptag"><small>${L.from}</small> ${esc(r.price)}<small>/${r.unit ? esc(T(r.unit, lang)).replace(/^(per|sa|san) /, '') : (lang === 'ga' ? 'oíche' : 'night')}</small></span>` : ''}</div>
        <div class="card-body"><h3>${esc(T(r.name, lang))}</h3>
        <p>${esc(T(r.desc, lang))}</p>
        <p class="meta">${r.sleeps ? `<span>${icon('bed', 18)} ${L.sleeps(r.sleeps)}</span>` : ''}${r.price ? `<span class="price">${L.from} <b>${esc(r.price)}</b> ${r.unit ? esc(T(r.unit, lang)) : L.perNight}</span>` : ''}</p>
        <a class="btn btn-sm" href="#book" data-room="${esc(T(r.name, 'en'))}">${L.bookNow}</a></div>
      </article>`).join('')}</div></div></section>`);
  }

  // menu (café)
  if (has(site.menu)) {
    nav.push(['menu', L.menu]);
    S.push(`<section id="menu" class="sec menu"><div class="wrap"><h2>${L.menu}</h2><div class="menu-cols">${site.menu
      .map((g) => `<div class="menu-group"><h3>${esc(T(g.section, lang))}</h3><ul>${g.items.filter((it) => T(it.name, lang))
        .map((it) => `<li><span class="mi"><b>${esc(T(it.name, lang))}</b>${it.desc ? `<small>${esc(T(it.desc, lang))}</small>` : ''}</span><span class="dots"></span><span class="mp">${esc(it.price)}</span></li>`).join('')}</ul></div>`).join('')}</div>
      ${site.menuNote ? `<p class="note">${esc(T(site.menuNote, lang))}</p>` : ''}</div></section>`);
  }

  // services (trades)
  if (has(site.services)) {
    nav.push(['services', L.services]);
    S.push(`<section id="services" class="sec services"><div class="wrap"><h2>${L.services}</h2><div class="svc">${site.services.filter((x) => T(x.name, lang))
      .map((s) => `<div class="svc-item rv">${icon(s.icon || 'tool', 28)}<h3>${esc(T(s.name, lang))}</h3><p>${esc(T(s.desc, lang))}</p></div>`).join('')}</div>
      ${has(site.areas) ? `<h3 class="areas-h">${L.areas}</h3><p class="areas">${site.areas.map(esc).join(' · ')}</p>` : ''}
      ${has(site.credentials) ? `<ul class="creds">${site.credentials.map((c) => `<li>${icon('shield', 18)} ${esc(T(c, lang))}</li>`).join('')}</ul>` : ''}
    </div></section>`);
  }

  // reviews
  if (has(site.reviews)) {
    nav.push(['reviews', type === 'bnb' ? L.reviews : (lang === 'ga' ? 'Tuairimí na gcustaiméirí' : 'What customers say')]);
    S.push(`<section id="reviews" class="sec reviews"><div class="wrap"><h2>${type === 'bnb' ? L.reviews : (lang === 'ga' ? 'Tuairimí na gcustaiméirí' : 'What customers say')}</h2>
      <div class="rev-wrap">${site.rating ? `<div class="score rv"><b>${esc(site.rating.score)}</b><span class="stars">${'★'.repeat(Math.round(Number(site.rating.score) > 5 ? Number(site.rating.score) / 2 : Number(site.rating.score)))}</span><small>${esc(L.ratedOn(site.rating.score, site.rating.count, site.rating.source)).replace(/^[^·]*· /, '')}<br>${esc(site.rating.source)}</small></div>` : ''}
      <div class="quotes${site.rating && Number(site.rating.score) >= (Number(site.rating.score) > 5 ? 9 : 4.5) ? ' five' : ''}">${site.reviews.map((r) => `<blockquote class="rv"><p>“${esc(T(r.text, lang))}”</p><footer>${esc(r.author || '')}${r.source ? ` · ${esc(r.source)}` : ''}</footer></blockquote>`).join('')}</div></div></div></section>`);
  }

  // gallery
  if (has(site.photos) && site.photos.length > 2) {
    S.push(`<section class="sec gallery"><div class="wrap"><h2>${site.galleryTitle ? esc(T(site.galleryTitle, lang)) : L.gallery}</h2><div class="grid">${site.photos.slice(2)
      .map((p) => `<img src="${esc(img(p.src))}" alt="${esc(T(p.alt, lang))}" loading="lazy">`).join('')}</div></div></section>`);
  }

  // hours (café)
  if (has(site.hours)) {
    S.push(`<section id="hours" class="sec hours"><div class="wrap two"><div><h2>${L.hours}</h2>${site.openingSpec ? `<p class="open-now" data-open='${esc(JSON.stringify(site.openingSpec))}' data-lang="${lang}" hidden></p>` : ''}<table class="hours-t">${site.hours
      .map((h) => `<tr><th>${esc(T(h.days, lang))}</th><td>${h.time ? esc(h.time) : L.closed}</td></tr>`).join('')}</table></div>
      <div class="hours-art">${site.photos?.length > 1 ? `<img src="${esc(img(site.photos[site.photos.length - 1].src))}" alt="" loading="lazy">` : landscape(theme, 3)}</div></div></section>`);
  }

  // booking / quote / contact form
  const formKind = type === 'bnb' ? 'booking' : type === 'trades' ? 'quote' : 'contact';
  const formEndpoint = site.formEndpoint || '';
  const mode = booking.mode || (type === 'bnb' ? 'request' : 'request');
  nav.push(['book', type === 'bnb' ? L.bookDirect : type === 'trades' ? L.quote : L.contact]);
  let formInner = '';
  if (type === 'bnb' && mode === 'embed' && booking.embedUrl) {
    formInner = `<iframe class="engine" src="${esc(booking.embedUrl)}" title="${L.bookingTitle}" loading="lazy"></iframe>`;
  } else {
    const roomOpts = has(site.rooms) ? `<label>${L.room}<select name="${L.room}" data-price-select><option value="" data-price="0">${L.anyRoom}</option>${site.rooms
      .map((r) => `<option value="${esc(T(r.name, lang))}" data-key="${esc(T(r.name, 'en'))}" data-price="${priceNumber(r.price)}">${esc(T(r.name, lang))}${r.price ? ` (${esc(r.price)})` : ''}</option>`).join('')}</select></label>` : '';
    const fields = type === 'bnb'
      ? `<div class="row3"><label>${L.arrive}<input type="date" name="${L.arrive}" required data-arrive></label>
         <label>${L.depart}<input type="date" name="${L.depart}" required data-depart></label>
         <label>${L.guests}<select name="${L.guests}">${[1, 2, 3, 4, 5, 6].map((n) => `<option${n === 2 ? ' selected' : ''}>${n}</option>`).join('')}</select></label></div>
         ${roomOpts}<p class="estimate" data-estimate aria-live="polite"></p>`
      : type === 'trades'
        ? `<label>${L.service}<select name="${L.service}">${(site.services || []).map((s) => `<option>${esc(T(s.name, lang))}</option>`).join('')}</select></label>
           <label>${L.location}<input name="${L.location}" required></label>
           <label>${L.details}<textarea name="${L.details}" rows="3" required></textarea></label>`
        : '';
    const sendLabel = type === 'bnb' ? L.send : type === 'trades' ? L.sendQuote : L.sendMsg;
    formInner = `<form class="req" data-form data-kind="${formKind}" data-biz="${esc(site.name)}" data-wa="${wa}" data-email="${esc(site.email || '')}" data-endpoint="${esc(isSample ? '' : formEndpoint)}" data-sample="${isSample ? 1 : 0}" data-currency="€" data-lang="${lang}">
      ${fields}
      <div class="row2"><label>${L.name}<input name="${L.name}" required autocomplete="name"></label>
      <label>${L.yourPhone}<input name="${L.yourPhone}" type="tel" autocomplete="tel"></label></div>
      <label>${L.yourEmail}<input name="${L.yourEmail}" type="email" autocomplete="email" ${wa ? '' : 'required'}></label>
      ${type !== 'trades' ? `<label>${type === 'bnb' ? L.message : L.message}<textarea name="${L.message}" rows="3"></textarea></label>` : ''}
      <label class="chk"><input type="checkbox" required> <span>${L.consent}</span></label>
      <button class="btn btn-lg" type="submit">${sendLabel}</button>
      ${!formEndpoint || isSample ? `<p class="small">${wa ? L.viaWhatsapp : ''}</p>` : ''}
      <p class="ok" data-ok hidden>${L.thanks}</p>
    </form>`;
  }
  const deposit = booking.depositLink ? `<div class="deposit"><a class="btn btn-ghost" href="${esc(booking.depositLink)}" target="_blank" rel="noopener">${icon('shield', 18)} ${L.payDeposit}</a><small>${L.depositNote}</small></div>` : '';
  const policies = has(booking.policies) ? `<details class="pol"><summary>${L.policies}</summary><ul>${booking.policies.map((p) => `<li>${esc(T(p, lang))}</li>`).join('')}</ul></details>` : '';
  const bookBg = site.bookingPhoto || site.photos?.[3]?.src || site.photos?.[0]?.src;
  S.push(`<section id="book" class="sec book${bookBg ? ' book-photo' : ''}"${bookBg ? ` style="background-image:url('${esc(img(bookBg))}')"` : ''}><div class="wrap two">
    <div class="book-intro"><h2>${type === 'bnb' ? L.bookingTitle : type === 'trades' ? L.quote : (site.ctaLabel ? esc(T(site.ctaLabel, lang)) : L.contact)}</h2>
      ${type === 'bnb' ? `<p>${L.bookingIntro}</p>` : site.contactIntro ? `<p>${esc(T(site.contactIntro, lang))}</p>` : ''}
      ${booking.directDiscount ? `<p class="save">${icon('euro', 20)} ${L.saveVs(esc(booking.directDiscount))}</p>` : type === 'bnb' ? `<p class="save">${icon('euro', 20)} ${L.bestPrice}</p>` : ''}
      <ul class="contact-list">
        ${phone ? `<li><a href="tel:${esc(phone.replace(/\s/g, ''))}">${icon('phone', 20)} ${esc(phone)}</a></li>` : ''}
        ${wa ? `<li><a href="https://wa.me/${wa}" target="_blank" rel="noopener">${icon('chat', 20)} ${L.whatsapp}</a></li>` : ''}
        ${site.email ? `<li><a href="mailto:${esc(site.email)}">${icon('mail', 20)} ${esc(site.email)}</a></li>` : ''}
      </ul>${deposit}${policies}
    </div>
    <div class="book-form">${formInner}</div>
  </div></section>`);

  // FAQ
  if (has(site.faq)) {
    S.push(`<section class="sec faq"><div class="wrap narrow"><h2>${L.faq}</h2>${site.faq
      .map((f) => `<details><summary>${esc(T(f.q, lang))}</summary><p>${esc(T(f.a, lang))}</p></details>`).join('')}</div></section>`);
  }

  // map
  if (site.mapQuery) {
    nav.push(['find', L.findUs]);
    const q = encodeURIComponent(site.mapQuery);
    S.push(`<section id="find" class="sec find"><div class="wrap two">
      <div><h2>${L.findUs}</h2>${site.address ? `<p>${icon('pin', 20)} ${esc(site.address)}</p>` : ''}${site.directionsNote ? `<p>${esc(T(site.directionsNote, lang))}</p>` : ''}
      <a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">${L.directions}</a></div>
      <div class="map"><iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${q}&output=embed"></iframe></div>
    </div></section>`);
  }

  // ---------- page ----------
  const title = `${site.name}${site.area ? ` · ${site.area}` : ''}`;
  const desc = T(site.seo?.description, lang) || T(site.tagline, lang);
  const heroImg = site.photos?.[0]?.src;
  const rating = site.rating ? `<span class="chip">${icon('star', 16)} ${esc(site.rating.score)} · ${esc(site.rating.count)} ${lang === 'ga' ? 'léirmheas' : 'reviews'} (${esc(site.rating.source)})</span>` : '';
  const ld = {
    '@context': 'https://schema.org',
    '@type': type === 'bnb' ? 'BedAndBreakfast' : type === 'cafe' ? 'CafeOrCoffeeShop' : 'HomeAndConstructionBusiness',
    name: site.name,
    description: desc,
    telephone: phone || undefined,
    email: site.email || undefined,
    address: site.address || undefined,
    areaServed: site.areas || undefined,
    aggregateRating: site.rating && !isSample ? { '@type': 'AggregateRating', ratingValue: site.rating.score, reviewCount: site.rating.count, bestRating: Number(site.rating.score) > 5 ? 10 : 5 } : undefined,
  };
  const langHref = lang === 'en' ? 'ga/' : '../';
  const primaryCta = type === 'bnb' ? L.bookDirect : type === 'trades' ? L.quote : (site.ctaLabel ? T(site.ctaLabel, lang) : L.contact);
  const studio = ctx.studio;
  const perkList = has(site.perks) ? site.perks : type === 'bnb' ? (lang === 'ga'
    ? [['euro', 'An praghas is fearr, ráthaithe'], ['shield', 'Gan táillí áirithinte'], ['calendar', 'Éarlais shlán le cárta'], ['chat', 'Freagra laistigh d’uaireanta']]
    : [['euro', 'Best price, guaranteed'], ['shield', 'No booking fees'], ['calendar', 'Secure card deposit'], ['chat', 'Reply within hours']]).map(([i, t]) => ({ icon: i, en: t, ga: t })) : [];
  const perks = perkList.length ? `<section class="perks"><div class="wrap perks-in">${perkList.map((p) => `<div>${icon(p.icon || 'check', 22)}<span>${esc(T(p, lang))}</span></div>`).join('')}</div></section>` : '';
  const stats = has(site.stats) ? `<section class="cstats"><div class="wrap cstats-in">${site.stats.map((x) => `<div class="rv"><b>${esc(x.n)}</b><span>${esc(T(x, lang))}</span></div>`).join('')}</div></section>` : '';

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${isSample || site.noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta name="theme-color" content="${th.accent}">
${bilingual ? `<link rel="alternate" hreflang="${other}" href="${langHref}">` : ''}
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='${th.accent}'/><text x='16' y='22' font-size='17' font-family='Georgia' text-anchor='middle' fill='#fff'>${esc((site.name || '?')[0])}</text></svg>`)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${rel}assets/site.css">
<script>document.documentElement.classList.add('js')</script>
<style>:root{--accent:${th.accent};--accent-ink:${th.accentInk};--paper:${th.paper};--sea:${th.sea};--soft:${th.sky1};--soft2:${th.sky2}}</style>
${isSample ? '' : `<script type="application/ld+json">${JSON.stringify(ld)}</script>`}
</head>
<body class="t-${type}">
${isSample ? `<div class="sample-bar">${esc(site.demo ? L.demoBanner(studio.studioName) : L.sampleBanner(site.name, studio.studioName))}</div>` : ''}
<header class="top"><div class="wrap topin">
  <a class="brand" href="#">${esc(site.name)}</a>
  <nav class="nav">${nav.filter(([id]) => id !== 'book').map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('')}</nav>
  <div class="top-actions">${bilingual ? `<a class="lang" href="${langHref}" hreflang="${other}" lang="${other}">${L.language}</a>` : ''}<a class="btn btn-sm" href="#book">${esc(primaryCta)}</a></div>
</div></header>

<section class="hero">
  <div class="hero-media">${heroImg ? `<img src="${esc(img(heroImg))}" alt="${esc(T(site.photos[0].alt, lang))}">` : landscape(theme, 0, { label: site.area || '' })}</div>
  <div class="hero-txt wrap">
    <div class="chips">${rating}${site.openingSpec ? `<span class="chip open-now" data-open='${esc(JSON.stringify(site.openingSpec))}' data-lang="${lang}" hidden></span>` : ''}</div>
    <h1>${esc(site.name)}</h1>
    <p class="tag">${esc(T(site.tagline, lang))}</p>
    ${site.area ? `<p class="where">${icon('pin', 18)} ${esc(site.area)}</p>` : ''}
    <div class="ctas"><a class="btn btn-lg" href="#book">${esc(primaryCta)}</a>${phone ? `<a class="btn btn-lg btn-ghost" href="tel:${esc(phone.replace(/\s/g, ''))}">${icon('phone', 18)} ${L.call}</a>` : ''}</div>
    ${type === 'bnb' ? `<p class="badge">${icon('check', 16)} ${booking.directDiscount ? L.saveVs(esc(booking.directDiscount)) : L.bestPrice}</p>` : ''}
  </div>
</section>

${perks}${stats}
<main>${S.join('\n')}</main>

<footer class="foot"><div class="wrap footin">
  <div><b>${esc(site.name)}</b>${site.address ? `<br>${esc(site.address)}` : ''}${phone ? `<br><a href="tel:${esc(phone.replace(/\s/g, ''))}">${esc(phone)}</a>` : ''}${site.email ? `<br><a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : ''}</div>
  <div class="foot-r">${site.registered ? `<small>${esc(site.registered)}</small><br>` : ''}<a href="${lang === 'en' ? '' : '../'}privacy.html">${L.privacy}</a> · <small>${L.madeBy} <a href="${esc(studio.siteUrl || '#')}">${esc(studio.studioName)}</a>${site.photos?.some((ph) => String(ph.src).startsWith('assets/img/')) ? ` · <a href="${esc(studio.siteUrl || rel)}credits.html">${lang === 'ga' ? 'Creidiúintí grianghraf' : 'Photo credits'}</a>` : ''}</small></div>
</div></footer>

<nav class="mbar" aria-label="Quick actions">
  ${phone ? `<a href="tel:${esc(phone.replace(/\s/g, ''))}">${icon('phone', 20)}<span>${L.call}</span></a>` : ''}
  ${wa ? `<a href="https://wa.me/${wa}" target="_blank" rel="noopener">${icon('chat', 20)}<span>WhatsApp</span></a>` : ''}
  ${site.mapQuery ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}" target="_blank" rel="noopener">${icon('pin', 20)}<span>${L.directions}</span></a>` : ''}
  <a class="mbar-main" href="#book">${icon(type === 'bnb' ? 'calendar' : 'mail', 20)}<span>${esc(primaryCta)}</span></a>
</nav>
<script src="${rel}assets/site.js" defer></script>
</body>
</html>`;
}

export function renderClientPrivacy(site, ctx) {
  const contact = [site.email, site.phone].filter(Boolean).map(esc).join(' / ');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privacy · ${esc(site.name)}</title>${site.sample ? '<meta name="robots" content="noindex">' : ''}
<link rel="stylesheet" href="${ctx.rel}assets/site.css"></head><body><main class="sec"><div class="wrap narrow legal">
<p><a href="./">← ${esc(site.name)}</a></p>
<h1>Privacy notice</h1>
<p><b>${esc(site.name)}</b>${site.address ? `, ${esc(site.address)}` : ''} is responsible for the personal data collected on this website.</p>
<h2>What we collect and why</h2>
<p>When you send a booking request, quote request or message, we receive the details you enter (name, contact details, dates and your message). We use them only to reply to you and, if you book, to manage your stay or job. The legal basis is taking steps at your request before entering a contract (GDPR Art. 6(1)(b)).</p>
<h2>Who else sees it</h2>
<p>If you choose WhatsApp, your message is sent through WhatsApp (Meta). Card payments are processed by Stripe; we never see your full card number. The map is provided by Google Maps, and the website is hosted by Vercel. We do not sell your data or use it for marketing without your consent.</p>
<h2>How long we keep it</h2>
<p>Enquiries that do not lead to a booking are deleted within 12 months. Booking records are kept for 6 years for tax purposes.</p>
<h2>Cookies</h2>
<p>This website does not set tracking or advertising cookies. The embedded map and payment pages may set their own cookies when you use them.</p>
<h2>Your rights</h2>
<p>You can ask to see, correct or delete your data at any time: ${contact || 'contact us'}. You can also complain to the Data Protection Commission (dataprotection.ie).</p>
</div></main></body></html>`;
}
