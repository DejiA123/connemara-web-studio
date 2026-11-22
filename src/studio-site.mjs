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
      key: 'found', name: 'Get Found', normal: '€350', founding: '€210', time: x('Ready in 1 week', 'Réidh i gceann seachtaine'),
      who: x('Cafés, pubs, tradespeople and small B&Bs that need to show up on Google.', 'Caiféanna, tithe tábhairne, ceardaithe agus B&Banna beaga ar gá dóibh a bheith le feiceáil ar Google.'),
      items: x(['Your Google Maps listing set up or fixed', 'A one-page website in Irish and English', 'Buttons to call or WhatsApp you, a map and photos', 'Looks great on phones'],
        ['Do liostáil ar Google Maps socraithe nó deisithe', 'Suíomh gréasáin aon leathanaigh i nGaeilge agus i mBéarla', 'Cnaipí le glaoch nó WhatsApp a chur chugat, léarscáil agus grianghraif', 'Breá le feiceáil ar ghutháin']),
      payLink: st.getFoundDeposit, payLabel: x('Pay €210', 'Íoc €210'),
    },
    {
      key: 'booked', featured: true, name: 'Get Booked', normal: '€950', founding: '€570', time: x('Ready in 2–3 weeks', 'Réidh i gceann 2–3 seachtaine'),
      who: x('B&Bs, guesthouses, holiday homes and activity providers.', 'B&Banna, tithe aíochta, tithe saoire agus soláthraithe gníomhaíochtaí.'),
      items: x(['Up to 5 pages in Irish and English', 'Guests book on your website and pay a deposit by card', 'Optional: link to your Booking.com and Airbnb calendars so you’re never double-booked (booking tool about €15–30 a month)', 'Your Google Maps listing set up', 'Booking guarantee (see below)'],
        ['Suas le 5 leathanach i nGaeilge agus i mBéarla', 'Cuireann aíonna in áirithe ar do shuíomh agus íocann siad éarlais le cárta', 'Roghnach: nasc le d’fhéilirí Booking.com agus Airbnb ionas nach mbeidh áirithint dhúbailte agat choíche (uirlis áirithinte thart ar €15–30 sa mhí)', 'Do liostáil ar Google Maps socraithe', 'Ráthaíocht áirithinte (féach thíos)']),
      payLink: st.getBookedDeposit, payLabel: x('Pay €285 deposit', 'Íoc éarlais €285'),
      plan: x('Or 3 payments of €190.<br><b>Or nothing up front: €39 a month</b> (12-month minimum, monthly support included).', 'Nó 3 íocaíocht de €190.<br><b>Nó faic roimh ré: €39 sa mhí</b> (12 mhí ar a laghad, tacaíocht mhíosúil san áireamh).'), planLink: st.getBookedPlan,
    },
    {
      key: 'sell', name: 'Sell Online', normal: '€1,200', founding: '€720', from: x('from', 'ó'), time: x('Ready in 3–4 weeks', 'Réidh i gceann 3–4 seachtaine'),
      who: x('Craft and food producers, shops and takeaways.', 'Lucht ceirde agus táirgeoirí bia, siopaí agus bia beir leat.'),
      items: x(['An online shop, or orders in advance', 'Customers pay by card', 'Delivery or collection, your choice', 'Irish and English'],
        ['Siopa ar líne, nó orduithe roimh ré', 'Íocann custaiméirí le cárta', 'Seachadadh nó bailiú, de réir do rogha', 'Gaeilge agus Béarla']),
    },
  ];

  const faq = [
    [x('Why is this cheaper than Booking.com?', 'Cén fáth a bhfuil sé seo níos saoire ná Booking.com?'),
      x('Booking.com takes 15% of every booking, forever: €15 from every €100 night. A guest who books on your own website costs you only the card fee, about €1.75. You keep Booking.com for new guests, and your own website takes the guests who already know you. With the €39 a month option, about 3 direct nights a month (at €100) already covers it.',
        'Tógann Booking.com 15% de gach áirithint, go deo: €15 as gach oíche €100. Ní chosnaíonn aoi a chuireann in áirithe ar do shuíomh féin ach táille an chárta, thart ar €1.75. Coinníonn tú Booking.com le haghaidh aíonna nua, agus glacann do shuíomh féin na haíonna a bhfuil aithne acu ort cheana. Leis an rogha €39 sa mhí, clúdaíonn thart ar 3 oíche dhíreacha sa mhí (ag €100) é.')],
    [x('Do I have to leave Booking.com or Airbnb?', 'An gcaithfidh mé Booking.com nó Airbnb a fhágáil?'),
      x('No. Keep them for new guests from abroad. Your own site wins the guests who already know your name: returning guests, word of mouth and people who Google you after finding you on a booking site. Your calendars stay linked, so you’re never double-booked.',
        'Ní chaithfidh. Coinnigh iad le haghaidh aíonna nua ó thar lear. Mealltar le do shuíomh féin na haíonna a bhfuil d’ainm acu cheana: aíonna a thagann ar ais, moladh ó bhéal agus daoine a chuardaíonn ar Google thú. Fanann na féilirí nasctha, ionas nach mbeidh áirithint dhúbailte agat.')],
    [x('Am I allowed to offer a cheaper price on my own site?', 'An bhfuil cead agam praghas níos saoire a thairiscint ar mo shuíomh féin?'),
      x('Yes. Since 14 November 2024 Booking.com can no longer stop properties in the EU offering better prices on their own websites (an EU law called the Digital Markets Act).',
        'Tá. Ó 14 Samhain 2024 ní féidir le Booking.com cosc a chur ar áiseanna san AE praghsanna níos fearr a thairiscint ar a suíomhanna féin (Acht AE um Margaí Digiteacha).')],
    [x('What if I don’t like the sample?', 'Cad a tharlaíonn mura dtaitníonn an sampla liom?'),
      x('Then you don’t pay anything and we part as friends. There is no obligation at all.', 'Ansin ní íocann tú faic. Níl aon cheangal ort ar chor ar bith.')],
    [x('What are the running costs?', 'Cad iad na costais reatha?'),
      x('Your web address (like yourbnb.ie) costs about €15–30 a year and is registered in your name. Optional monthly support (from €39 a month) keeps the website online, safe and up to date, and covers small changes like new prices or photos. Card payments cost about 1.5% + €0.25 each (Stripe’s fee, not mine).',
        'Cosnaíonn do sheoladh gréasáin (mar shampla yourbnb.ie) thart ar €15–30 sa bhliain agus bíonn sé cláraithe i d’ainm féin. Coinníonn tacaíocht mhíosúil roghnach (ó €39 sa mhí) an suíomh ar líne, slán agus cothrom le dáta, agus clúdaíonn sí athruithe beaga ar nós praghsanna nó grianghraif nua. Cosnaíonn íocaíocht chárta thart ar 1.5% + €0.25 an ceann (táille Stripe, ní mo cheannsa).')],
    [x('Who owns the website?', 'Cé leis an suíomh?'),
      x('You do, once it is paid for. The web address is in your name from day one.', 'Is leatsa é, nuair a bhíonn sé íoctha. Bíonn an seoladh gréasáin i d’ainm féin ón gcéad lá.')],
    [x('How do guests pay?', 'Conas a íocann aíonna?'),
      x('By card, through Stripe (a secure payment service), straight into your bank account. You decide the deposit and cancellation rules.', 'Le cárta trí Stripe, díreach isteach i do chuntas bainc. Socraíonn tusa an éarlais agus na rialacha cealaithe.')],
    [x('Can we do it all in Irish?', 'An féidir linn é a dhéanamh ar fad i nGaeilge?'),
      x('Yes. Every site is in Irish and English at no extra cost, and we can talk in Irish too.', 'Is féidir. Bíonn gach suíomh i nGaeilge agus i mBéarla gan aon chostas breise, agus is féidir linn labhairt as Gaeilge freisin.')],
    [x('Does it follow data protection rules (GDPR)?', 'An gcloíonn sé le rialacha cosanta sonraí (GDPR)?'),
      x('Yes. Every site has a privacy notice, doesn’t track visitors, and only asks for what’s needed for a booking.', 'Cloíonn. Bíonn fógra príobháideachais ar gach suíomh, ní rianaítear cuairteoirí, agus ní iarrtar ach a bhfuil ag teastáil le haghaidh áirithinte.')],
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
<link rel="preload" as="image" href="${rel}assets/img/roundstone-golden.jpg">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfessionalService', name: s.studioName, areaServed: ['Connemara', 'County Galway', 'Aran Islands'], telephone: s.phone?.startsWith('TODO') ? undefined : s.phone, url: s.siteUrl?.includes('TODO') ? undefined : s.siteUrl, knowsLanguage: ['en', 'ga'] })}</script>
</head>
<body>
<header class="top"><div class="wrap topin">
  <a class="logo" href="#top">${icon('sea', 26)}<span>${esc(s.studioName).replace(/^Book Direct/, "<b>Book Direct</b>")}</span></a>
  <nav class="nav"><a href="#how">${x('How it works', 'Conas a oibríonn sé')}</a><a href="#prices">${x('Prices', 'Praghsanna')}</a><a href="#examples">${x('Examples', 'Samplaí')}</a><a href="#faq">${x('Questions', 'Ceisteanna')}</a></nav>
  <div class="top-actions"><a class="lang" href="${langHref}" hreflang="${other}" lang="${other}">${x('Gaeilge', 'English')}</a><a class="btn btn-sm" href="#contact">${x('Free sample', 'Sampla saor in aisce')}</a></div>
</div></header>

<section class="hero" id="top">
  <div class="hero-bg"><img src="${rel}assets/img/roundstone-golden.jpg" alt="${x('Roundstone harbour in Connemara at sunset', 'Cuan Chloch na Rón i gConamara ag luí na gréine')}" fetchpriority="high"></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${x('Websites for B&Bs and local businesses · Connemara & Galway', 'Suíomhanna do B&Banna agus do ghnólachtaí áitiúla · Conamara & Gaillimh')}</p>
      <h1>${x('Your guests already love you. <em>Let them book you direct.</em>', 'Is breá le d’aíonna thú. <em>Faigh a n-áirithintí go díreach.</em>')}</h1>
      <p class="lead">${x('Stop paying 15% commission on guests who already know your name. I’ll build your new website as a <b>free sample first</b>, and you only pay if you love it.', 'Ná híoc 15% coimisiúin ar aíonna a bhfuil d’ainm acu cheana. Tógfaidh mé do shuíomh nua mar <b>shampla saor in aisce ar dtús</b>, agus ní íocann tú ach má thaitníonn sé leat.')}</p>
      <div class="ctas"><a class="btn btn-lg btn-gold" href="#contact">${x('Get my free sample', 'Faigh mo shampla saor in aisce')} →</a>${tel && !tel.startsWith('TODO') ? `<a class="btn btn-lg btn-glass" href="tel:${esc(tel)}">${icon('phone', 18)} ${esc(s.phone)}</a>` : ''}</div>
      ${left > 0 ? `<p class="offer-note">${x(`Launch price for my first three clients: <b>€570</b> instead of €950, until ${esc(deadline)}. <u>${left} ${left === 1 ? 'place' : 'places'} left.</u>`, `Praghas seolta do mo chéad trí chliant: <b>€570</b> in ionad €950, go dtí ${esc(deadline)}. <u>${left} áit fágtha.</u>`)}</p>` : ''}
      <ul class="trust"><li>${icon('irish', 18)} ${x('Irish & English', 'Gaeilge & Béarla')}</li><li>${icon('calendar', 18)} ${x('Works alongside Booking.com & Airbnb', 'Oibríonn sé taobh le Booking.com & Airbnb')}</li><li>${icon('pin', 18)} ${x('Local: I call in and answer the phone', 'Áitiúil: tagaim ar cuairt agus freagraím an fón')}</li></ul>
    </div>
    ${demos[0] ? `<div class="phone" aria-hidden="true"><div class="phone-in"><iframe src="${rel}${esc(demos[0].path)}${lang === 'ga' && demos[0].bilingual ? 'ga/' : ''}" title="Example" tabindex="-1" loading="lazy"></iframe></div></div>` : ''}
  </div>
</section>

<section class="stats"><div class="wrap stats-in">
  <div class="rv"><b>15%</b><span>${x('you keep when a guest books you directly', 'a choinníonn tú nuair a chuireann aoi in áirithe leat go díreach')}</span></div>
  <div class="rv"><b>48h</b><span>${x('to see your free sample', 'chun do shampla saor in aisce a fheiceáil')}</span></div>
  <div class="rv"><b>€0</b><span>${x('to see your sample. You only pay if you love it.', 'chun do shampla a fheiceáil. Ní íocann tú ach má thaitníonn sé leat.')}</span></div>
  <div class="rv"><b>2</b><span>${x('languages: Irish and English', 'theanga: Gaeilge agus Béarla')}</span></div>
</div></section>

<section class="sec calc-sec" id="cost"><div class="wrap two">
  <div>
    <h2>${x('What the booking sites really cost you', 'Cad a chosnaíonn na suíomhanna áirithinte duit i ndáiríre')}</h2>
    <p>${x('Booking.com takes around 15% of every stay, even when the guest has stayed before or found you by word of mouth. If even some of those guests book on your own website instead, that money stays with you.', 'Tógann Booking.com thart ar 15% de gach fanacht, fiú nuair a d’fhan an t-aoi cheana nó nuair a chuala sé fút ó dhuine eile. Má chuireann fiú cuid de na haíonna sin in áirithe ar do shuíomh féin, fanann an t-airgead sin agatsa.')}</p>
    <p class="muted small">${x('Type in your own numbers.', 'Cuir isteach d’uimhreacha féin.')}</p>
  </div>
  <form class="calc" data-calc data-price="570" data-lang="${lang}" onsubmit="return false">
    <label class="q">${x('1. What do you charge for a room, per night?', '1. Cé mhéad a ghearrann tú ar sheomra, san oíche?')}<small>${x('For example €100.', 'Mar shampla €100.')}</small><span class="eur"><input name="rate" type="number" inputmode="numeric" value="100" min="0"></span></label>
    <label class="q">${x('2. Roughly how many nights a year do guests book you through Booking.com or Airbnb?', '2. Thart ar cé mhéad oíche sa bhliain a chuireann aíonna in áirithe leat trí Booking.com nó Airbnb?')}<small>${x('A rough guess is fine. A busy B&B might have about 200.', 'Is leor buille faoi thuairim. B’fhéidir go mbeadh thart ar 200 ag B&B gnóthach.')}</small><input name="nights" type="number" inputmode="numeric" value="200" min="0"></label>
    <p class="calc-line">${x('Booking sites take about', 'Tógann suíomhanna áirithinte thart ar')} <b data-out="paid">€3,000</b> ${x('a year from you (15% of each booking).', 'sa bhliain uait (15% de gach áirithint).')}</p>
    <p class="calc-big">${x('If just 1 in 4 of those guests booked on your own website instead, you’d save', 'Dá gcuirfeadh 1 as gach 4 de na haíonna sin in áirithe ar do shuíomh féin, shábhálfá')} <b data-out="saved">€750</b> ${x('a year.', 'sa bhliain.')}</p>
    <p class="calc-line" data-out="payback"></p>
  </form>
</div></section>

<section class="sec alt" id="compare-bk"><div class="wrap narrow">
  <h2 class="center">${x('Booking.com vs your own website', 'Booking.com i gcomparáid le do shuíomh féin')}</h2>
  <p class="center muted">${x('For a €100 night. Keep Booking.com for new guests. Your website is for the guests who already know you.', 'Do oíche €100. Coinnigh Booking.com le haghaidh aíonna nua. Is do na haíonna a bhfuil aithne acu ort cheana do shuíomh.')}</p>
  <div class="vs rv"><table>
    <tr><th></th><th>Booking.com</th><th class="us">${x('Your website', 'Do shuíomh')}<small>${x('€570 once', '€570 uair amháin')}</small></th><th class="us">${x('Your website', 'Do shuíomh')}<small>${x('€39 a month', '€39 sa mhí')}</small></th></tr>
    <tr><td>${x('To start', 'Le tosú')}</td><td>€0</td><td class="us">€570<small>${x('or 3 × €190', 'nó 3 × €190')}</small></td><td class="us">€0</td></tr>
    <tr><td>${x('Each €100 night', 'Gach oíche €100')}</td><td class="bad">€15</td><td class="us good">€1.75<small>${x('card fee', 'táille cárta')}</small></td><td class="us good">€1.75<small>${x('card fee', 'táille cárta')}</small></td></tr>
    <tr><td>${x('Every month', 'Gach mí')}</td><td>€0</td><td class="us">€0<small>${x('support optional', 'tacaíocht roghnach')}</small></td><td class="us">€39<small>${x('support included', 'tacaíocht san áireamh')}</small></td></tr>
    <tr><td>${x('Cheaper than Booking.com after', 'Níos saoire ná Booking.com tar éis')}</td><td>–</td><td class="us"><b>${x('about 43 direct nights', 'thart ar 43 oíche dhíreach')}</b><small>${x('then you keep the savings, every year', 'ansin coinníonn tú an choigilt, gach bliain')}</small></td><td class="us"><b>${x('about 3 direct nights a month', 'thart ar 3 oíche dhíreach sa mhí')}</b></td></tr>
  </table></div>
</div></section>

<section class="sec" id="how"><div class="wrap">
  <h2 class="center">${x('How it works', 'Conas a oibríonn sé')}</h2>
  <ol class="steps">
    <li class="rv"><span class="n">1</span><h3>${x('Free sample', 'Sampla saor in aisce')}</h3><p>${x('Tell me about your place. Within 48 hours I make a sample homepage for your business. No cost, no obligation.', 'Inis dom faoi d’áit. Laistigh de 48 uair an chloig déanfaidh mé leathanach baile samplach do do ghnó. Saor in aisce, gan cheangal.')}</p></li>
    <li class="rv"><span class="n">2</span><h3>${x('Five-minute look', 'Breathnú cúig nóiméad')}</h3><p>${x('I call in (or we do a quick video call) and show it to you on your phone.', 'Tagaim ar cuairt (nó déanaimid glao físe gearr) agus taispeánaim duit é ar do ghuthán.')}</p></li>
    <li class="rv"><span class="n">3</span><h3>${x('Pay half to start', 'Íoc leath chun tosú')}</h3><p>${x('Like it? Pay half to start. I collect your prices, photos and house rules (deposit, cancellations) and build the rest.', 'Taitníonn sé leat? Íoc leath chun tosú. Bailím do phraghsanna, grianghraif agus rialacha an tí (éarlais, cealuithe) agus tógaim an chuid eile.')}</p></li>
    <li class="rv"><span class="n">4</span><h3>${x('Your website goes online', 'Téann do shuíomh ar líne')}</h3><p>${x('You see the finished website before you pay the rest. Then it goes online and guests can book you directly.', 'Feiceann tú an suíomh críochnaithe sula n-íocann tú an chuid eile. Ansin téann sé ar líne agus is féidir le haíonna áirithint a dhéanamh leat go díreach.')}</p></li>
  </ol>
</div></section>

<section class="sec alt" id="prices"><div class="wrap">
  <h2 class="center">${x('Simple, fixed prices', 'Praghsanna simplí, socraithe')}</h2>
  <p class="center muted">${left > 0 ? x(`Special launch prices for my first 3 clients who sign up by ${esc(deadline)}. ${left} ${left === 1 ? 'place' : 'places'} left.`, `Praghsanna speisialta seolta do mo chéad 3 chliant a chláraíonn roimh ${esc(deadline)}. ${left} áit fágtha.`) : x('Half to start, half at launch.', 'Leath chun tosú, leath ag an seoladh.')}</p>
  <div class="pkgs">
  ${packages.map((p) => `<article class="rv pkg${p.featured ? ' featured' : ''}">
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
    <div><h3>${x('Monthly support (optional)', 'Tacaíocht mhíosúil (roghnach)')}</h3><p class="muted">${x('I keep your website online, safe and up to date, so you never have to think about it. Minimum 6 months, then cancel any time.', 'Coinním do shuíomh ar líne, slán agus cothrom le dáta, ionas nach gcaithfidh tú smaoineamh air choíche. 6 mhí ar a laghad, ansin cealaigh am ar bith.')}</p></div>
    <div class="care-row"><b>Basic · €39${x('/month', '/mí')}</b><span>${x('Your website kept online, safe and backed up, plus 30 minutes of changes a month (new prices, photos)', 'Do shuíomh coinnithe ar líne, slán agus cúltaca déanta, móide 30 nóiméad d’athruithe sa mhí (praghsanna, grianghraif nua)')}</span></div>
    <div class="care-row"><b>Growth · €90${x('/month', '/mí')}</b><span>${x('Everything in Basic, plus 4 posts a month on your Google listing, replies to your reviews, 1 hour of changes and a short monthly update', 'Gach rud in Basic, móide 4 phostáil sa mhí ar do liostáil Google, freagraí ar do léirmheasanna, 1 uair an chloig d’athruithe agus nuashonrú gearr míosúil')}</span></div>
    <p class="muted small">${x('Extras: simple logo €150 · a third language (French or German) €150 · photos of your place €100 · Google ads set up €150 (plus whatever you choose to spend on ads).', 'Breiseáin: lógó simplí €150 · tríú teanga (Fraincis nó Gearmáinis) €150 · grianghraif de d’áit €100 · fógraí Google a shocrú €150 (móide an méid a roghnaíonn tú a chaitheamh ar fhógraí).')}</p>
  </div>
</div></section>

<section class="band" style="background-image:url('${rel}assets/img/beach.jpg')"><div class="wrap band-in rv">
  <p class="band-q">${x('“Every guest who books you on Booking.com and then Googles your name is a guest you could have had for free.”', '“Gach aoi a chuireann in áirithe trí Booking.com agus a chuardaíonn d’ainm ar Google ina dhiaidh sin, d’fhéadfá é a bheith agat saor in aisce.”')}</p>
  <a class="btn btn-lg btn-gold" href="#contact">${x('Show me what mine would look like', 'Taispeáin dom cén chuma a bheadh ar mo cheann')} →</a>
</div></section>

<section class="sec" id="guarantee"><div class="wrap">
  <h2 class="center">${x('No risk to you', 'Gan riosca duit')}</h2>
  <div class="guar">
    <div class="rv">${icon('euro', 30)}<h3>${x('See it before paying anything', 'Feic é sula n-íocann tú faic')}</h3><p>${x('Your sample is free. If you don’t love it, you owe nothing.', 'Tá do shampla saor in aisce. Mura dtaitníonn sé leat, níl faic le híoc.')}</p></div>
    <div class="rv">${icon('shield', 30)}<h3>${x('Booking guarantee', 'Ráthaíocht áirithinte')}</h3><p>${x('If your website hasn’t brought you at least one booking by 30 June 2027, your monthly support is free until it does.', 'Mura bhfuil áirithint amháin ar a laghad faighte agat ó do shuíomh faoi 30 Meitheamh 2027, beidh do thacaíocht mhíosúil saor in aisce go dtí go bhfaighidh.')}</p></div>
    <div class="rv">${icon('calendar', 30)}<h3>${x('Live before Easter', 'Beo roimh an gCáisc')}</h3><p>${x('Sign up now and your website will be online by 1 March 2027, or I’ll refund your deposit.', 'Cláraigh anois agus beidh do shuíomh ar líne faoi 1 Márta 2027, nó gheobhaidh tú d’éarlais ar ais.')}</p></div>
    <div class="rv">${icon('irish', 30)}<h3>${x('Irish and English', 'Gaeilge agus Béarla')}</h3><p>${x('Every website comes in Irish and English at no extra cost. Is féidir linn labhairt as Gaeilge.', 'Bíonn gach suíomh dátheangach gan aon chostas breise.')}</p></div>
  </div>
</div></section>

${demos.length ? `<section class="sec alt" id="examples"><div class="wrap">
  <h2 class="center">${x('See what you’d get', 'Feic cad a gheobhfá')}</h2>
  <p class="center muted">${x('Example sites for made-up businesses. Open them on your phone: they work, including the booking form.', 'Suíomhanna samplacha do ghnólachtaí samhailteacha. Oscail ar do ghuthán iad: oibríonn siad, an fhoirm áirithinte san áireamh.')}</p>
  <div class="demos">${demos.map((d, i) => `<a class="demo rv" href="${rel}${esc(d.path)}${lang === 'ga' && d.bilingual ? 'ga/' : ''}">
    <div class="demo-art">${d.image ? `<img src="${rel}${esc(d.image)}" alt="" loading="lazy">` : landscape(d.theme, i)}</div>
    <div class="demo-body"><span class="kind">${esc(lang === 'ga' ? d.kindGa : d.kind)}</span><h3>${esc(d.name)}</h3><p>${esc(d.blurb[lang] || d.blurb.en)}</p><span class="go">${x('Open example', 'Oscail an sampla')} →</span></div>
  </a>`).join('')}</div>
</div></section>` : ''}

<section class="sec" id="compare"><div class="wrap narrow">
  <h2>${x('Why not just…', 'Cén fáth nach…')}</h2>
  <div class="cmp">
    <div><h3>${x('…stay on Booking.com?', '…fanacht ar Booking.com?')}</h3><p>${x('Keep it. It brings new guests. Your own site stops you paying 15% on the guests who would have found you anyway.', 'Coinnigh é. Tugann sé aíonna nua. Stopann do shuíomh féin tú ó 15% a íoc ar na haíonna a d’aimseodh thú ar aon nós.')}</p></div>
    <div><h3>${x('…build it myself with Wix?', '…é a thógáil mé féin le Wix?')}</h3><p>${x('You can, if you have the evenings. I set it up, write it in both languages, link your calendars, keep it running, and answer the phone.', 'Is féidir, má tá na tráthnónta agat. Socraím é, scríobhaim i dhá theanga é, nascaim na féilirí, coinním ag rith é, agus freagraím an fón.')}</p></div>
    <div><h3>${x('…hire a Galway agency?', '…gníomhaireacht i nGaillimh a fhostú?')}</h3><p>${x('Many build websites that look nice but can’t take a booking. Mine take bookings, link to your Booking.com calendar, and you see a working sample before you pay.', 'Tógann go leor acu suíomhanna deasa nach féidir leo áirithint a ghlacadh. Glacann mo cheannsa le háirithintí, nasctar iad le d’fhéilire Booking.com, agus feiceann tú sampla oibre sula n-íocann tú.')}</p></div>
  </div>
</div></section>

<section class="sec alt" id="about"><div class="wrap two">
  <div class="about-art"><img src="${rel}assets/img/boardwalk.jpg" alt="${x('Boardwalk on Diamond Hill, Connemara National Park', 'Cosán adhmaid ar an gCnoc Diamant, Páirc Náisiúnta Chonamara')}" loading="lazy"></div>
  <div>
    <h2>${s.ownerName ? `${x('Hi, I’m', 'Dia duit, is mise')} ${esc(s.ownerName)}` : x('About me', 'Fúm féin')}</h2>
    <p>${x(`I’m a web developer based in ${esc(s.baseArea)}. I build websites that do one job: bring local businesses more direct bookings and customers, with less money going to the big booking sites.`, `Is forbróir gréasáin mé atá lonnaithe i ${esc(s.baseArea)}. Tógaim suíomhanna a dhéanann jab amháin: níos mó áirithintí díreacha agus custaiméirí a thabhairt do ghnólachtaí áitiúla, le níos lú airgid ag dul chuig na suíomhanna móra áirithinte.`)}</p>
    <p>${x('I’m local, so I can call in, sit at your kitchen table and show you everything on your phone. And when something needs changing, you ring me, not a helpdesk.', 'Táim áitiúil, mar sin is féidir liom teacht ar cuairt, suí ag bord do chistine agus gach rud a thaispeáint duit ar do ghuthán. Agus nuair is gá rud a athrú, glaonn tú ormsa, ní ar dheasc cabhrach.')}</p>
  </div>
</div></section>

<section class="sec" id="faq"><div class="wrap narrow">
  <h2>${x('Questions owners ask', 'Ceisteanna a chuireann úinéirí')}</h2>
  ${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}
</div></section>

<section class="sec contact" id="contact" style="background-image:url('${rel}assets/img/harbour-bens.jpg')"><div class="wrap two">
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
      <label>${x('What would you like?', 'Cad ba mhaith leat?')}<select name="${x('Interested in', 'Spéis i')}"><option>Get Booked (€570)</option><option>${x('Get Booked monthly (€39/month)', 'Get Booked míosúil (€39/mí)')}</option><option>Get Found (€210)</option><option>Sell Online</option><option>${x('Not sure yet', 'Níl mé cinnte fós')}</option></select></label>
      <label>${x('Anything else? (website, Booking.com link…)', 'Aon rud eile? (suíomh, nasc Booking.com…)')}<textarea name="${x('Message', 'Teachtaireacht')}" rows="3"></textarea></label>
      <label class="chk"><input type="checkbox" required> <span>${x('I agree that my details are used only to reply to me.', 'Aontaím nach n-úsáidfear mo chuid sonraí ach le freagra a thabhairt orm.')}</span></label>
      <button class="btn btn-lg btn-block" type="submit">${x('Send', 'Seol')}</button>
      <p class="ok" data-ok hidden>${x('Thanks! I’ll be in touch within one working day.', 'Go raibh maith agat! Beidh mé i dteagmháil leat laistigh de lá oibre amháin.')}</p>
    </form>
  </div>
</div></section>

<footer class="foot"><div class="wrap footin">
  <div><b>${esc(s.studioName)}</b><br>${esc(s.ownerName)} · ${esc(s.baseArea)}</div>
  <div class="foot-r"><a href="${lang === 'en' ? '' : '../'}privacy.html">${x('Privacy', 'Príobháideachas')}</a> · <a href="${lang === 'en' ? '' : '../'}credits.html">${x('Photo credits', 'Creidiúintí grianghraf')}</a>${s.social?.facebook ? ` · <a href="${esc(s.social.facebook)}">Facebook</a>` : ''}${s.social?.instagram ? ` · <a href="${esc(s.social.instagram)}">Instagram</a>` : ''}<br><small>© ${new Date().getFullYear()} ${esc(s.studioName)}</small></div>
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
