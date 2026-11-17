// Your own studio website, in English (/) and Irish (/ga/).
import { esc } from './client-site.mjs';
import { landscape, icon } from './art.mjs';

export function renderStudio(studio, lang, ctx) {
  const x = (en, ga) => (lang === 'ga' ? ga : en);
  const rel = ctx.rel;
  const s = studio;
  const tel = String(s.phoneIntl || '').replace(/[^\d]/g, '') ? '+' + String(s.phoneIntl).replace(/[^\d]/g, '') : (s.phone || '').replace(/\s/g, '');
  const wa = String(s.phoneIntl || '').replace(/[^\d]/g, '');
  const left = Math.max(0, Number(s.founding?.placesLeft ?? 3));
  const deadline = lang === 'ga' ? s.founding?.deadlineGa : s.founding?.deadline;
  const st = s.stripe || {};
  const demos = ctx.demos || [];
  const other = lang === 'en' ? 'ga' : 'en';
  const langHref = lang === 'en' ? 'ga/' : '../';

  const pay = (link, label) => (link ? `<a class="btn btn-ghost btn-block" href="${esc(link)}" target="_blank" rel="noopener">${icon('shield', 18)} ${label}</a>` : '');

  const packages = [
    {
      key: 'found', name: 'Get Found', normal: '€350', founding: '€210', time: x('Live in 1 week', 'Beo laistigh de sheachtain'),
      who: x('Cafés, pubs, tradespeople and small B&Bs that need to show up on Google.', 'Caiféanna, tithe tábhairne, ceardaithe agus B&Banna beaga ar gá dóibh a bheith le feiceáil ar Google.'),
      items: x(['Google Business Profile set up or fixed', 'One-page site in Irish and English', 'Call and WhatsApp buttons, map and photos', 'Works perfectly on phones'],
        ['Próifíl Google Business socraithe nó deisithe', 'Suíomh aon leathanaigh i nGaeilge agus i mBéarla', 'Cnaipí glao agus WhatsApp, léarscáil agus grianghraif', 'Oibríonn sé go foirfe ar ghutháin']),
      payLink: st.getFoundDeposit, payLabel: x('Pay €210', 'Íoc €210'),
    },
    {
      key: 'booked', featured: true, name: 'Get Booked', normal: '€950', founding: '€570', time: x('Live in 2–3 weeks', 'Beo laistigh de 2–3 seachtaine'),
      who: x('B&Bs, guesthouses, holiday homes and activity providers.', 'B&Banna, tithe aíochta, tithe saoire agus soláthraithe gníomhaíochtaí.'),
      items: x(['Up to 5 pages in Irish and English', 'Direct booking with card deposits', 'Calendar synced with Booking.com and Airbnb, so no double bookings', 'Google Business Profile and basics done', 'Booking guarantee (see below)'],
        ['Suas le 5 leathanach i nGaeilge agus i mBéarla', 'Áirithint dhíreach le héarlais chárta', 'Féilire sioncronaithe le Booking.com agus Airbnb, gan áirithintí dúbailte', 'Próifíl Google Business agus na bunrudaí déanta', 'Ráthaíocht áirithinte (féach thíos)']),
      payLink: st.getBookedDeposit, payLabel: x('Pay €285 deposit', 'Íoc éarlais €285'),
      plan: x('Or 3 payments of €190', 'Nó 3 íocaíocht de €190'), planLink: st.getBookedPlan,
    },
    {
      key: 'sell', name: 'Sell Online', normal: '€1,200', founding: '€720', from: x('from', 'ó'), time: x('Live in 3–4 weeks', 'Beo laistigh de 3–4 seachtaine'),
      who: x('Craft and food producers, shops and takeaways.', 'Lucht ceirde agus táirgeoirí bia, siopaí agus bia beir leat.'),
      items: x(['Online shop or pre-orders', 'Card payments', 'Product pages, delivery and collection', 'Irish and English'],
        ['Siopa ar líne nó réamhorduithe', 'Íocaíochtaí cárta', 'Leathanaigh táirgí, seachadadh agus bailiú', 'Gaeilge agus Béarla']),
    },
  ];

  const faq = [
    [x('Do I have to leave Booking.com or Airbnb?', 'An gcaithfidh mé Booking.com nó Airbnb a fhágáil?'),
      x('No. Keep them for new guests from abroad. Your own site wins the guests who already know your name: returning guests, word of mouth and people who Google you after finding you on a booking site. The calendars stay in sync.',
        'Ní chaithfidh. Coinnigh iad le haghaidh aíonna nua ó thar lear. Mealltar le do shuíomh féin na haíonna a bhfuil d’ainm acu cheana: aíonna a thagann ar ais, moladh ó bhéal agus daoine a chuardaíonn ar Google thú. Fanann na féilirí i sioncronú.')],
    [x('Am I allowed to offer a cheaper price on my own site?', 'An bhfuil cead agam praghas níos saoire a thairiscint ar mo shuíomh féin?'),
      x('Yes. Since 14 November 2024 Booking.com can no longer stop properties in the EU offering better prices on their own websites (EU Digital Markets Act).',
        'Tá. Ó 14 Samhain 2024 ní féidir le Booking.com cosc a chur ar áiseanna san AE praghsanna níos fearr a thairiscint ar a suíomhanna féin (Acht AE um Margaí Digiteacha).')],
    [x('What if I don’t like the sample?', 'Cad a tharlaíonn mura dtaitníonn an sampla liom?'),
      x('Then you don’t pay anything and we part as friends. There is no obligation at all.', 'Ansin ní íocann tú faic. Níl aon cheangal ort ar chor ar bith.')],
    [x('What are the running costs?', 'Cad iad na costais reatha?'),
      x('Your domain name costs about €15–30 a year and is registered in your name. Hosting is included in the care plans (from €40 a month), which also cover security updates, backups and small changes.',
        'Cosnaíonn d’ainm fearainn thart ar €15–30 sa bhliain agus bíonn sé cláraithe i d’ainm féin. Tá an t-óstáil san áireamh sna pleananna cúraim (ó €40 sa mhí), a chlúdaíonn nuashonruithe slándála, cúltacaí agus athruithe beaga freisin.')],
    [x('Who owns the website?', 'Cé leis an suíomh?'),
      x('You do, once it is paid for. The domain is in your name from day one.', 'Is leatsa é, nuair a bhíonn sé íoctha. Bíonn an fearann i d’ainm féin ón gcéad lá.')],
    [x('How do guests pay?', 'Conas a íocann aíonna?'),
      x('By card through Stripe, straight into your bank account. You decide the deposit and cancellation rules.', 'Le cárta trí Stripe, díreach isteach i do chuntas bainc. Socraíonn tusa an éarlais agus na rialacha cealaithe.')],
    [x('Can we do it all in Irish?', 'An féidir linn é a dhéanamh ar fad i nGaeilge?'),
      x('Yes. Every site is in Irish and English at no extra cost, and we can talk in Irish too.', 'Is féidir. Bíonn gach suíomh i nGaeilge agus i mBéarla gan aon chostas breise, agus is féidir linn labhairt as Gaeilge freisin.')],
    [x('Is it GDPR compliant?', 'An bhfuil sé de réir GDPR?'),
      x('Yes. Every site has a privacy notice, no tracking cookies, and collects only what is needed for a booking.', 'Tá. Bíonn fógra príobháideachais ar gach suíomh, gan fianáin rianaithe, agus ní bhailítear ach a bhfuil ag teastáil le haghaidh áirithinte.')],
  ];

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(s.studioName)} · ${x('Booking websites for Connemara businesses', 'Suíomhanna áirithinte do ghnólachtaí Chonamara')}</title>
<meta name="description" content="${x('Websites with direct booking for B&Bs, guesthouses and local businesses in Connemara and Galway. Irish and English. See a free sample before you pay.', 'Suíomhanna le háirithint dhíreach do B&Banna, tithe aíochta agus gnólachtaí áitiúla i gConamara agus i nGaillimh. Gaeilge agus Béarla. Feic sampla saor in aisce sula n-íocann tú.')}">
<meta property="og:title" content="${esc(s.studioName)}">
<meta property="og:description" content="${x('Stop paying commission on guests who already know your name. Free sample first.', 'Ná híoc coimisiún ar aíonna a bhfuil d’ainm acu cheana. Sampla saor in aisce ar dtús.')}">
<meta name="theme-color" content="#1f4e6b">
<link rel="alternate" hreflang="${other}" href="${langHref}">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='#1f4e6b'/><path d='M5 22l6-8 4 5 3-3 9 6z' fill='#fff'/><circle cx='23' cy='10' r='3' fill='#f2c66d'/></svg>")}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${rel}assets/studio.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfessionalService', name: s.studioName, areaServed: ['Connemara', 'County Galway', 'Aran Islands'], telephone: s.phone?.startsWith('TODO') ? undefined : s.phone, url: s.siteUrl?.includes('TODO') ? undefined : s.siteUrl, knowsLanguage: ['en', 'ga'] })}</script>
</head>
<body>
<header class="top"><div class="wrap topin">
  <a class="logo" href="#top">${icon('sea', 26)}<span>${esc(s.studioName).replace(/^Book Direct/, "<b>Book Direct</b>")}</span></a>
  <nav class="nav"><a href="#how">${x('How it works', 'Conas a oibríonn sé')}</a><a href="#prices">${x('Prices', 'Praghsanna')}</a><a href="#examples">${x('Examples', 'Samplaí')}</a><a href="#faq">${x('Questions', 'Ceisteanna')}</a></nav>
  <div class="top-actions"><a class="lang" href="${langHref}" hreflang="${other}" lang="${other}">${x('Gaeilge', 'English')}</a><a class="btn btn-sm" href="#contact">${x('Free sample', 'Sampla saor in aisce')}</a></div>
</div></header>

<section class="hero" id="top">
  <div class="hero-bg">${landscape('atlantic', 0)}</div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      ${left > 0 ? `<p class="pill">${icon('star', 16)} ${x(`Founding offer: ${left} ${left === 1 ? 'place' : 'places'} left at 40% off, book by ${esc(deadline)}`, `Tairiscint bhunaidh: ${left} ${left === 1 ? 'áit' : 'áit'} fágtha ar 40% lascaine, cuir in áirithe roimh ${esc(deadline)}`)}</p>` : ''}
      <h1>${x('Websites that take bookings, for Connemara businesses.', 'Suíomhanna a ghlacann le háirithintí, do ghnólachtaí Chonamara.')}</h1>
      <p class="lead">${x('Stop paying 15% commission on guests who already know your name. I’ll make you a <b>free sample homepage first</b>, and you only pay if you love it.', 'Ná híoc 15% coimisiúin ar aíonna a bhfuil d’ainm acu cheana. Déanfaidh mé <b>leathanach baile samplach saor in aisce</b> duit ar dtús, agus ní íocann tú ach má thaitníonn sé leat.')}</p>
      <div class="ctas"><a class="btn btn-lg" href="#contact">${x('Get my free sample', 'Faigh mo shampla saor in aisce')}</a>${tel && !tel.startsWith('TODO') ? `<a class="btn btn-lg btn-ghost" href="tel:${esc(tel)}">${icon('phone', 18)} ${esc(s.phone)}</a>` : ''}</div>
      <ul class="trust"><li>${icon('irish', 18)} ${x('Irish & English', 'Gaeilge & Béarla')}</li><li>${icon('calendar', 18)} ${x('Synced with Booking.com & Airbnb', 'Sioncronaithe le Booking.com & Airbnb')}</li><li>${icon('pin', 18)} ${x('Local: I call in and answer the phone', 'Áitiúil: tagaim ar cuairt agus freagraím an fón')}</li></ul>
    </div>
    ${demos[0] ? `<div class="phone" aria-hidden="true"><div class="phone-in"><iframe src="${rel}${esc(demos[0].path)}" title="Example" tabindex="-1" loading="lazy"></iframe></div></div>` : ''}
  </div>
</section>

<section class="sec calc-sec" id="cost"><div class="wrap two">
  <div>
    <h2>${x('What the booking sites really cost you', 'Cad a chosnaíonn na suíomhanna áirithinte duit i ndáiríre')}</h2>
    <p>${x('Booking.com takes around 15% of every stay, even when the guest has stayed before or found you by word of mouth. Move just some of those guests to your own site and it pays for itself, then keeps paying.', 'Tógann Booking.com thart ar 15% de gach fanacht, fiú nuair a d’fhan an t-aoi cheana nó nuair a chuala sé fút ó dhuine eile. Bog cuid de na haíonna sin chuig do shuíomh féin agus íocann sé as féin, agus leanann sé ag íoc.')}</p>
    <p class="muted small">${x('Move the sliders to match your business.', 'Bog na sleamhnáin le hoiriúint do do ghnó.')}</p>
  </div>
  <form class="calc" data-calc data-price="570" data-lang="${lang}" onsubmit="return false">
    <label>${x('Average room rate per night (€)', 'Meánráta seomra san oíche (€)')}<input name="rate" type="number" inputmode="numeric" value="100" min="0"></label>
    <label>${x('Nights booked through booking sites per year', 'Oícheanta curtha in áirithe trí shuíomhanna áirithinte in aghaidh na bliana')}<input name="nights" type="number" inputmode="numeric" value="200" min="0"></label>
    <label>${x('Commission (%)', 'Coimisiún (%)')}<input name="pct" type="number" inputmode="numeric" value="15" min="0" max="40"></label>
    <label>${x('Share of those guests who would book you direct', 'Cion de na haíonna sin a chuirfeadh in áirithe go díreach')}: <b data-out="share">25%</b><input name="share" type="range" min="0" max="60" step="5" value="25"></label>
    <div class="calc-out">
      <div><small>${x('Commission you pay now, per year', 'Coimisiún a íocann tú anois, in aghaidh na bliana')}</small><b data-out="paid">€3,000</b></div>
      <div class="hi"><small>${x('You could keep, per year', 'D’fhéadfá a choinneáil, in aghaidh na bliana')}</small><b data-out="saved">€750</b></div>
      <div><small>${x('A €570 site pays for itself after', 'Íocann suíomh €570 as féin tar éis')}</small><b data-out="payback">38</b></div>
    </div>
  </form>
</div></section>

<section class="sec" id="how"><div class="wrap">
  <h2 class="center">${x('How it works', 'Conas a oibríonn sé')}</h2>
  <ol class="steps">
    <li><span class="n">1</span><h3>${x('Free sample', 'Sampla saor in aisce')}</h3><p>${x('Tell me about your place. Within 48 hours I make a sample homepage for your business. No cost, no obligation.', 'Inis dom faoi d’áit. Laistigh de 48 uair an chloig déanfaidh mé leathanach baile samplach do do ghnó. Saor in aisce, gan cheangal.')}</p></li>
    <li><span class="n">2</span><h3>${x('Five-minute look', 'Breathnú cúig nóiméad')}</h3><p>${x('I call in (or we do a quick video call) and show it to you on your phone.', 'Tagaim ar cuairt (nó déanaimid glao físe gearr) agus taispeánaim duit é ar do ghuthán.')}</p></li>
    <li><span class="n">3</span><h3>${x('Half to start', 'Leath chun tosú')}</h3><p>${x('Like it? Pay half to start. I collect your prices, photos and booking rules and build the rest.', 'Taitníonn sé leat? Íoc leath chun tosú. Bailím do phraghsanna, grianghraif agus rialacha áirithinte agus tógaim an chuid eile.')}</p></li>
    <li><span class="n">4</span><h3>${x('Live, and booking', 'Beo, agus ag glacadh áirithintí')}</h3><p>${x('You see the whole finished site before paying the balance. Then it goes live and guests book you direct.', 'Feiceann tú an suíomh críochnaithe ar fad sula n-íocann tú an t-iarmhéid. Ansin téann sé beo agus cuireann aíonna in áirithe leat go díreach.')}</p></li>
  </ol>
</div></section>

<section class="sec alt" id="prices"><div class="wrap">
  <h2 class="center">${x('Simple, fixed prices', 'Praghsanna simplí, socraithe')}</h2>
  <p class="center muted">${left > 0 ? x(`Founding prices for the first 3 businesses booked by ${esc(deadline)}. ${left} left.`, `Praghsanna bunaidh don chéad 3 ghnó a chuireann in áirithe roimh ${esc(deadline)}. ${left} fágtha.`) : x('Half to start, half at launch.', 'Leath chun tosú, leath ag an seoladh.')}</p>
  <div class="pkgs">
  ${packages.map((p) => `<article class="pkg${p.featured ? ' featured' : ''}">
    ${p.featured ? `<span class="ribbon">${x('Most popular for B&Bs', 'Is mó éileamh i measc B&Banna')}</span>` : ''}
    <h3>${p.name}</h3><p class="who">${p.who}</p>
    <p class="cost">${p.from ? `<small>${p.from}</small> ` : ''}${left > 0 ? `<s>${p.normal}</s> <b>${p.founding}</b>` : `<b>${p.normal}</b>`}</p>
    <p class="time">${icon('clock', 16)} ${p.time}</p>
    <ul>${p.items.map((i) => `<li>${icon('check', 18)} ${i}</li>`).join('')}</ul>
    ${p.plan ? `<p class="muted small">${p.plan}</p>` : ''}
    <a class="btn btn-block" href="#contact" data-pkg="${p.name}">${x('Free sample first', 'Sampla saor in aisce ar dtús')}</a>
    ${pay(p.payLink, p.payLabel)}${pay(p.planLink, x('Pay in 3 instalments', 'Íoc i 3 thráthchuid'))}
  </article>`).join('')}
  </div>
  <div class="care">
    <div><h3>${x('Care plans', 'Pleananna cúraim')}</h3><p class="muted">${x('Hosting, security and changes, so you never have to think about the website. 6-month minimum, cancel any time after.', 'Óstáil, slándáil agus athruithe, ionas nach gcaithfidh tú smaoineamh ar an suíomh choíche. 6 mhí ar a laghad, cealaigh am ar bith ina dhiaidh sin.')}</p></div>
    <div class="care-row"><b>Basic · €40${x('/month', '/mí')}</b><span>${x('Hosting, security updates, backups, 30 minutes of changes a month', 'Óstáil, nuashonruithe slándála, cúltacaí, 30 nóiméad d’athruithe sa mhí')}</span></div>
    <div class="care-row"><b>Growth · €90${x('/month', '/mí')}</b><span>${x('Basic, plus 4 Google posts, replies to your reviews, 1 hour of changes and a short monthly report', 'Basic, móide 4 phostáil Google, freagraí ar do léirmheasanna, 1 uair an chloig d’athruithe agus tuairisc ghearr mhíosúil')}</span></div>
    <p class="muted small">${x('Add-ons: simple logo €150 · extra language (French or German) €150 · phone photo shoot €100 · Google Ads setup €150 plus your ad budget.', 'Breiseáin: lógó simplí €150 · teanga bhreise (Fraincis nó Gearmáinis) €150 · grianghraif le fón €100 · Google Ads a shocrú €150 móide do bhuiséad fógraíochta.')}</p>
  </div>
</div></section>

<section class="sec" id="guarantee"><div class="wrap">
  <h2 class="center">${x('No risk to you', 'Gan riosca duit')}</h2>
  <div class="guar">
    <div>${icon('euro', 30)}<h3>${x('See it before paying anything', 'Feic é sula n-íocann tú faic')}</h3><p>${x('Your sample is free. If you don’t love it, you owe nothing.', 'Tá do shampla saor in aisce. Mura dtaitníonn sé leat, níl faic le híoc.')}</p></div>
    <div>${icon('shield', 30)}<h3>${x('Booking guarantee', 'Ráthaíocht áirithinte')}</h3><p>${x('If your site hasn’t brought you a direct booking by 30 June 2027, your care plan is free until it does.', 'Mura bhfuil áirithint dhíreach faighte agat ó do shuíomh faoi 30 Meitheamh 2027, beidh do phlean cúraim saor in aisce go dtí go bhfaighidh.')}</p></div>
    <div>${icon('calendar', 30)}<h3>${x('Live before Easter', 'Beo roimh an gCáisc')}</h3><p>${x('Founding sites go live by 1 March 2027, or you get your deposit back.', 'Beidh suíomhanna bunaidh beo faoi 1 Márta 2027, nó gheobhaidh tú d’éarlais ar ais.')}</p></div>
    <div>${icon('irish', 30)}<h3>${x('Irish and English', 'Gaeilge agus Béarla')}</h3><p>${x('Every site is bilingual at no extra cost. Is féidir linn labhairt as Gaeilge.', 'Bíonn gach suíomh dátheangach gan aon chostas breise.')}</p></div>
  </div>
</div></section>

${demos.length ? `<section class="sec alt" id="examples"><div class="wrap">
  <h2 class="center">${x('See what you’d get', 'Feic cad a gheobhfá')}</h2>
  <p class="center muted">${x('Example sites for made-up businesses. Open them on your phone: they work, including the booking form.', 'Suíomhanna samplacha do ghnólachtaí samhailteacha. Oscail ar do ghuthán iad: oibríonn siad, an fhoirm áirithinte san áireamh.')}</p>
  <div class="demos">${demos.map((d, i) => `<a class="demo" href="${rel}${esc(d.path)}${lang === 'ga' && d.bilingual ? 'ga/' : ''}">
    <div class="demo-art">${landscape(d.theme, i)}</div>
    <div class="demo-body"><span class="kind">${esc(lang === 'ga' ? d.kindGa : d.kind)}</span><h3>${esc(d.name)}</h3><p>${esc(d.blurb[lang] || d.blurb.en)}</p><span class="go">${x('Open example', 'Oscail an sampla')} →</span></div>
  </a>`).join('')}</div>
</div></section>` : ''}

<section class="sec" id="compare"><div class="wrap narrow">
  <h2>${x('Why not just…', 'Cén fáth nach…')}</h2>
  <div class="cmp">
    <div><h3>${x('…stay on Booking.com?', '…fanacht ar Booking.com?')}</h3><p>${x('Keep it. It brings new guests. Your own site stops you paying 15% on the guests who would have found you anyway.', 'Coinnigh é. Tugann sé aíonna nua. Stopann do shuíomh féin tú ó 15% a íoc ar na haíonna a d’aimseodh thú ar aon nós.')}</p></div>
    <div><h3>${x('…use Wix or a DIY tool?', '…Wix nó uirlis DIY a úsáid?')}</h3><p>${x('You can, if you have the evenings. I set it up, write it in both languages, sync the calendars, keep it running, and answer the phone.', 'Is féidir, má tá na tráthnónta agat. Socraím é, scríobhaim i dhá theanga é, sioncronaím na féilirí, coinním ag rith é, agus freagraím an fón.')}</p></div>
    <div><h3>${x('…hire a Galway agency?', '…gníomhaireacht i nGaillimh a fhostú?')}</h3><p>${x('Most build brochure sites that can’t take a booking. You get booking, calendar sync and a working demo before you pay.', 'Tógann a bhformhór suíomhanna bróisiúir nach féidir leo áirithint a ghlacadh. Gheobhaidh tusa áirithint, sioncronú féilire agus sampla oibre sula n-íocann tú.')}</p></div>
  </div>
</div></section>

<section class="sec alt" id="about"><div class="wrap two">
  <div class="about-art">${landscape('heather', 2)}</div>
  <div>
    <h2>${s.ownerName ? `${x('Hi, I’m', 'Dia duit, is mise')} ${esc(s.ownerName)}` : x('About me', 'Fúm féin')}</h2>
    <p>${x(`I’m a web developer based in ${esc(s.baseArea)}. I build websites that do one job: bring local businesses more direct bookings and customers, with less paid to the big platforms.`, `Is forbróir gréasáin mé atá lonnaithe i ${esc(s.baseArea)}. Tógaim suíomhanna a dhéanann jab amháin: níos mó áirithintí díreacha agus custaiméirí a thabhairt do ghnólachtaí áitiúla, le níos lú íoctha leis na hardáin mhóra.`)}</p>
    <p>${x('I’m local, so I can call in, sit at your kitchen table and show you everything on your phone. And when something needs changing, you ring me, not a helpdesk.', 'Táim áitiúil, mar sin is féidir liom teacht ar cuairt, suí ag bord do chistine agus gach rud a thaispeáint duit ar do ghuthán. Agus nuair is gá rud a athrú, glaonn tú ormsa, ní ar dheasc cabhrach.')}</p>
  </div>
</div></section>

<section class="sec" id="faq"><div class="wrap narrow">
  <h2>${x('Questions owners ask', 'Ceisteanna a chuireann úinéirí')}</h2>
  ${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}
</div></section>

<section class="sec contact" id="contact"><div class="wrap two">
  <div>
    <h2>${x('Get your free sample', 'Faigh do shampla saor in aisce')}</h2>
    <p>${x('Tell me the name of your business and I’ll have a sample homepage ready within 48 hours. No cost, no obligation.', 'Inis dom ainm do ghnó agus beidh leathanach baile samplach réidh agam laistigh de 48 uair an chloig. Saor in aisce, gan cheangal.')}</p>
    <ul class="contact-list">
      ${tel && !tel.startsWith('TODO') ? `<li><a href="tel:${esc(tel)}">${icon('phone', 20)} ${esc(s.phone)}</a></li>` : ''}
      ${wa ? `<li><a href="https://wa.me/${wa}" target="_blank" rel="noopener">${icon('chat', 20)} WhatsApp</a></li>` : ''}
      ${s.email && !s.email.startsWith('TODO') ? `<li><a href="mailto:${esc(s.email)}">${icon('mail', 20)} ${esc(s.email)}</a></li>` : ''}
    </ul>
  </div>
  <div class="formcard">
    <form class="req" data-form data-kind="contact" data-biz="${esc(s.studioName)}" data-wa="${wa}" data-email="${esc(s.email?.startsWith('TODO') ? '' : s.email)}" data-endpoint="${esc(s.formEndpoint || '')}" data-lang="${lang}">
      <div class="row2"><label>${x('Your name', 'D’ainm')}<input name="${x('Name', 'Ainm')}" required autocomplete="name"></label>
      <label>${x('Business name', 'Ainm an ghnó')}<input name="${x('Business', 'Gnó')}" required></label></div>
      <div class="row2"><label>${x('Phone', 'Fón')}<input name="${x('Phone', 'Fón')}" type="tel" autocomplete="tel"></label>
      <label>${x('Email', 'Ríomhphost')}<input name="${x('Email', 'Ríomhphost')}" type="email" autocomplete="email"></label></div>
      <label>${x('What would you like?', 'Cad ba mhaith leat?')}<select name="${x('Interested in', 'Spéis i')}"><option>Get Booked (€570)</option><option>Get Found (€210)</option><option>Sell Online</option><option>${x('Not sure yet', 'Níl mé cinnte fós')}</option></select></label>
      <label>${x('Anything else? (website, Booking.com link…)', 'Aon rud eile? (suíomh, nasc Booking.com…)')}<textarea name="${x('Message', 'Teachtaireacht')}" rows="3"></textarea></label>
      <label class="chk"><input type="checkbox" required> <span>${x('I agree that my details are used only to reply to me.', 'Aontaím nach n-úsáidfear mo chuid sonraí ach le freagra a thabhairt orm.')}</span></label>
      <button class="btn btn-lg btn-block" type="submit">${x('Send', 'Seol')}</button>
      <p class="ok" data-ok hidden>${x('Thanks! I’ll be in touch within one working day.', 'Go raibh maith agat! Beidh mé i dteagmháil leat laistigh de lá oibre amháin.')}</p>
    </form>
  </div>
</div></section>

<footer class="foot"><div class="wrap footin">
  <div><b>${esc(s.studioName)}</b><br>${esc(s.ownerName)} · ${esc(s.baseArea)}</div>
  <div class="foot-r"><a href="${lang === 'en' ? '' : '../'}privacy.html">${x('Privacy', 'Príobháideachas')}</a>${s.social?.facebook ? ` · <a href="${esc(s.social.facebook)}">Facebook</a>` : ''}${s.social?.instagram ? ` · <a href="${esc(s.social.instagram)}">Instagram</a>` : ''}<br><small>© ${new Date().getFullYear()} ${esc(s.studioName)}</small></div>
</div></footer>

<nav class="mbar" aria-label="Quick actions">
  ${tel && !tel.startsWith('TODO') ? `<a href="tel:${esc(tel)}">${icon('phone', 20)}<span>${x('Call', 'Glaoigh')}</span></a>` : ''}
  ${wa ? `<a href="https://wa.me/${wa}" target="_blank" rel="noopener">${icon('chat', 20)}<span>WhatsApp</span></a>` : ''}
  <a class="mbar-main" href="#contact">${icon('star', 20)}<span>${x('Free sample', 'Sampla saor in aisce')}</span></a>
</nav>
<script src="${rel}assets/site.js" defer></script>
<script>document.querySelectorAll('[data-pkg]').forEach(function(a){a.addEventListener('click',function(){var s=document.querySelector('#contact select');if(!s)return;for(var i=0;i<s.options.length;i++){if(s.options[i].text.indexOf(a.dataset.pkg)===0)s.selectedIndex=i}})})</script>
</body>
</html>`;
}

export function renderStudioPrivacy(s) {
  const contact = [s.email, s.phone].filter((v) => v && !v.startsWith('TODO')).map(esc).join(' / ') || 'the contact details on the home page';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Privacy · ${esc(s.studioName)}</title><link rel="stylesheet" href="assets/studio.css"></head>
<body><main class="sec"><div class="wrap narrow legal"><p><a href="./">← ${esc(s.studioName)}</a></p>
<h1>Privacy notice</h1>
<p>${esc(s.studioName)} is run by ${esc(s.ownerName)}, a sole trader in ${esc(s.baseArea)}. This notice explains how I handle personal data.</p>
<h2>What I collect</h2><p>If you contact me, I receive what you send: your name, business, contact details and message. I use it only to reply and, if we work together, to deliver and invoice the work (GDPR Art. 6(1)(b)). Invoices are kept for 6 years for Revenue.</p>
<h2>Marketing</h2><p>I don’t send marketing emails without your consent, and I don’t make marketing calls to mobile numbers without your agreement. If you ask me not to contact you again, I won’t.</p>
<h2>Who else sees it</h2><p>Messages sent by WhatsApp go through WhatsApp (Meta). Card payments are handled by Stripe. I never sell your data.</p>
<h2>Cookies</h2><p>This website sets no tracking or advertising cookies.</p>
<h2>Your rights</h2><p>Ask to see, correct or delete your data any time: ${contact}. You can complain to the Data Protection Commission at dataprotection.ie.</p>
</div></main></body></html>`;
}
