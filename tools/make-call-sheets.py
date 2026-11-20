#!/usr/bin/env python3
"""Builds docs/call-cheat-sheet.html (Sheet 1) and docs/call-cheat-sheet-2.html (Sheet 2).
Run: python3 tools/make-call-sheets.py && node tools/make-call-sheets-pdf.cjs"""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ME = 'Ayodeji Augustine'
PHONE = '086 073 6836'
SITE = 'bookdirectconnemara.vercel.app'

STYLE = """<style>
  @page{size:A4;margin:8mm}
  *{box-sizing:border-box}
  body{margin:0;font:8.4pt/1.3 "Inter","Helvetica Neue",Arial,sans-serif;color:#14212b;background:#fff}
  .page{max-width:194mm;margin:0 auto}
  header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #17506b;padding-bottom:4px;margin-bottom:6px}
  h1{font:700 15pt/1 Georgia,serif;margin:0;color:#17506b}
  h1 span{color:#c98a12}
  .me{text-align:right;font-size:8pt;color:#44535c}.me b{color:#14212b;font-size:9pt}
  h2{font:700 9.4pt/1.1 Georgia,serif;margin:0 0 4px;color:#17506b;text-transform:uppercase;letter-spacing:.04em}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:7px}
  .box{border:1px solid #d6dde1;border-radius:6px;padding:5px 7px;margin-bottom:6px;break-inside:avoid}
  .gold{background:#fff8e8;border-color:#ecd59c}.blue{background:#eef4f7;border-color:#c7d8e2}
  .goal{background:#17506b;color:#fff;border-radius:6px;padding:6px 9px;margin-bottom:6px;font-size:9pt}
  .goal b{color:#f3c25e}
  ul{margin:0;padding-left:13px}li{margin:1.5px 0}
  .say{font-weight:700}
  .step{display:grid;grid-template-columns:20px 1fr;gap:6px;align-items:start;margin:0 0 6px}
  .n{width:20px;height:20px;border-radius:50%;background:#e7a93c;color:#2a1b03;font-weight:800;display:grid;place-items:center;font-size:9.5pt}
  .step p{margin:0}.step .t{font-weight:700;color:#17506b;font-size:8.8pt}
  .yn{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:2px}
  .yes,.no{border-radius:6px;padding:5px 7px}
  .yes{background:#e6f4ea;border:1.3px solid #2e8b57}.no{background:#f8ecea;border:1.3px solid #b5523f}
  .yes b.h{color:#1f6b3e}.no b.h{color:#9a3a28}
  .yes ol,.no ol{margin:2px 0 0;padding-left:14px}
  table{width:100%;border-collapse:collapse}
  td,th{border-bottom:1px solid #e3e7ea;padding:2.4px 3px;vertical-align:top;text-align:left}
  th{font-size:7.4pt;text-transform:uppercase;letter-spacing:.04em;color:#5a6870;border-bottom:1.5px solid #14212b}
  .calls td:first-child{width:12px}
  .tick{display:inline-block;width:10px;height:10px;border:1.3px solid #14212b;border-radius:2px;margin-top:1px}
  .num{white-space:nowrap;font-weight:700}
  .hook{color:#33424b;font-size:7.9pt}
  .url{font-size:7.3pt;color:#17506b}
  .res{width:62px;border-left:1px dashed #cfd6da}
  .offer{display:inline-block;font-size:7.3pt;font-weight:700;border-radius:3px;padding:0 4px;margin-left:3px;background:#17506b;color:#fff;vertical-align:1px}
  .offer.f{background:#2e8b57}.offer.s{background:#7a5a9c}
  .chk{font-size:7.3pt;font-weight:700;color:#9a3a28}
  .obj td:first-child{width:33%;font-weight:700}
  .money{display:flex;gap:5px;text-align:center;font-weight:800;font-size:10pt}
  .money div{flex:1;border:1.5px solid #17506b;border-radius:5px;padding:2px;background:#fff}
  .money small{display:block;font-weight:400;font-size:7.2pt;color:#44535c}
  .codes{display:grid;grid-template-columns:auto 1fr;gap:1px 7px;font-size:8pt}
  .codes b{color:#17506b}
  footer{font-size:7.2pt;color:#6b777e;text-align:center;margin-top:1px}
  @media screen{body{background:#e9edef;padding:16px}.page{background:#fff;padding:10mm;box-shadow:0 8px 30px rgba(0,0,0,.12)}}
</style>"""

OFFER = {'570': ('€570 Get Booked', ''), '210': ('€210 Get Found', 'f'), 'sup': ('€90/mo support', 's')}


def head(title):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title} · Book Direct Connemara</title>{STYLE}</head><body><div class="page">
<header><h1>{title} <span>· Book Direct Connemara</span></h1><div class="me"><b>{ME}</b> · {PHONE}<br>{SITE}</div></header>"""


def calls(title, rows, first_col='Business · number · what to say'):
    out = [f'<div class="box"><h2>{title}</h2><table class="calls"><tr><th></th><th>{first_col}</th><th class="res">Result</th></tr>']
    for r in rows:
        name, num, hook, offer = r[:4]
        extra = r[4] if len(r) > 4 else ''
        label, cls = OFFER[offer]
        out.append(f'<tr><td><span class="tick"></span></td><td><b>{name}</b> <span class="num">{num}</span><span class="offer {cls}">{label}</span>'
                   f'<div class="hook">{hook}</div>{extra}</td><td class="res"></td></tr>')
    out.append('</table></div>')
    return ''.join(out)


CODES = """<div class="box gold"><h2>Write one code in "Result"</h2><div class="codes">
<b>Y</b><span>Yes: link sent, visit or video call booked</span>
<b>VM</b><span>Voicemail left: try again on [day]</span>
<b>CB</b><span>Call back on [date + time]</span>
<b>J</b><span>"Ring me in January": write the date</span>
<b>N</b><span>Not interested: never contact again</span></div></div>"""

OFFER_BOX = """<div class="box blue"><h2>The offer (when they like the sample)</h2>
<div class="money"><div>€570<small>launch price (normally €950)</small></div><div>€285<small>now, to start</small></div><div>€285<small>when it's online</small></div></div>
<ul style="margin-top:4px">
<li>Or <b>3 payments of €190</b>. Launch price for the first 3 clients, until <b>20 December</b>.</li>
<li><b>"Too much up front?"</b> Offer: <b>nothing up front, €39 a month</b> (12 months minimum, support included). Push the €570 first: deposits are your December money.</li>
<li>Online by <b>1 March</b>, or they get the deposit back.</li>
<li>No booking from the website by 30 June 2027? Their <b>monthly support is free</b> until there is.</li>
<li>Small place that only needs Google + one page: <b>Get Found, €210</b>, ready in a week.</li>
<li>Payment: bank transfer is fine. Send the invoice from <code>tools/invoice.html</code>.</li></ul></div>"""

REMIND = """<div class="box gold" style="display:flex;gap:10px;align-items:center;justify-content:space-between;font-size:8.6pt"><span><b>1</b> Hello → <b>2</b> their line + 15% → <b>3</b> "Can I send you a free sample?" → <b>4</b> book a day and time</span><span><b style="color:#1f6b3e">YES:</b> send link, message Claude · <b style="color:#9a3a28">NO:</b> thank them, next</span></div>"""

VISITS = """<div class="box"><h2>Visit in person (mobile numbers: never ring)</h2><table class="calls"><tr><th></th><th>Business · where · what to say at the door</th><th class="res">Result</th></tr>
<tr><td><span class="tick"></span></td><td><b>Lig do Scíth</b> · Carraroe South<span class="offer">€570 Get Booked</span><div class="hook"><b>Speak Irish.</b> "Dia duit! Hundreds of great reviews but no website of your own. I made you this sample." Or 3 × €190.</div></td><td class="res"></td></tr>
<tr><td><span class="tick"></span></td><td><b>Seaview Lodge</b> · Inverin<span class="offer">€570 Get Booked</span><div class="hook">"Cyclists love you on Hostelworld. Let groups book beds directly."</div></td><td class="res"></td></tr>
<tr><td><span class="tick"></span></td><td><b>Teach an tSailín</b> · Inverin<span class="offer f">€210 Get Found</span><div class="hook"><span class="chk">Check it still takes guests.</span> "You're on Google Maps with no photos or reviews. I'll fix that in a week."</div></td><td class="res"></td></tr>
<tr><td><span class="tick"></span></td><td><b>Hollybanks</b> · Moycullen<span class="offer f">€210 Get Found</span><div class="hook">"Guests rave about your Connemara tips. A page with directions and your best tips."</div></td><td class="res"></td></tr>
<tr><td><span class="tick"></span></td><td><b>Portarra Lodge</b> · Moycullen<span class="offer">€570 Get Booked</span><div class="hook"><span class="chk">Might be sold: check first.</span> "Anglers love your lakeside spot."</div></td><td class="res"></td></tr>
</table><p class="hook" style="margin:3px 0 0">Ask Claude for their sample the day before, and bring it on your phone.</p></div>
"""

# ---------------------------------------------------------------- Sheet 1 (how to call)
s1 = head('Sheet 1: How to call').replace('</head>', '<style>body{font-size:9pt}.obj td{padding:2.6px 3px}.box{margin-bottom:6px}</style></head>') + f"""
<div class="goal">Your only goal on the phone: <b>get a YES to the free sample</b> and book a 5-minute look. Don't sell on the phone.</div>
<div class="cols"><div>
<div class="box gold"><h2>Before you dial</h2><ul>
<li><b>Only ring numbers starting 091, 095 or 099.</b> Never cold-call a mobile (08…): visit instead.</li>
<li>Best times: <b>Tue–Thu, 10:30–12:00 or 2–4pm</b>.</li>
<li>Only send a link or email <b>after they say yes</b> to it.</li></ul></div>

<div class="box"><h2>Say this, in this order</h2>
<div class="step"><span class="n">1</span><p><span class="t">Hello</span><br><span class="say">"Hi, is that [business]? My name is Ayodeji. I'm a web developer based locally. Have you got two minutes?"</span><br>Gaeltacht: start with <span class="say">"Dia duit"</span> and offer Irish.</p></div>
<div class="step"><span class="n">2</span><p><span class="t">Why you're calling</span><br>Read their line from Sheet 2 or 3, then:<br><span class="say">"Booking.com takes about 15% of every booking. You're allowed to offer a better price on your own website now."</span></p></div>
<div class="step"><span class="n">3</span><p><span class="t">The ask</span><br><span class="say">"I've made you a free sample website. No cost, no catch. Can I send you the link on WhatsApp, and call in for five minutes to show you?"</span></p></div>
<div class="step"><span class="n">4</span><p><span class="t">Book a time</span><br><span class="say">"What day suits you, and what time?"</span> Write it down before you hang up.</p></div>
<div class="yn">
<div class="yes"><b class="h">IF YES</b><ol><li>Send the sample link on WhatsApp (or email)</li><li>Write <b>Y</b> + the day</li><li>Message Claude (box below)</li></ol></div>
<div class="no"><b class="h">IF NO</b><ol><li><span class="say">"No problem at all, thanks for your time."</span></li><li>Write <b>N</b></li><li>Next call. Don't take it personally</li></ol></div>
</div></div>



<div class="box"><h2>Voicemail (only on 091/095/099 numbers)</h2>
<p style="margin:0" class="say">"Hi, this is Ayodeji, a local web developer. I've made a free sample website for [business], with direct booking. I'll try you again on [day], or ring me on {PHONE}. Thanks!"</p></div>
</div>

<div>
<div class="box"><h2>If they say…</h2><table class="obj">
<tr><td>"Just email me."</td><td><span class="say">"Happy to. What's the best address?"</span></td></tr>
<tr><td>"How much is it?"</td><td><span class="say">"€570 instead of €950 this month. Half to start, and you see it all before paying the rest."</span></td></tr>
<tr><td>"Too expensive."</td><td><span class="say">"Booking.com takes €15 of every €100 night, forever. About 43 nights booked direct pays for the website. Or 3 payments of €190."</span></td></tr>
<tr><td>"Can't pay that up front."</td><td><span class="say">"No problem: nothing up front, €39 a month. About 3 direct nights a month covers it."</span></td></tr>
<tr><td>"We're happy with Booking.com."</td><td><span class="say">"Keep it! This just saves the 15% on guests who already know you."</span></td></tr>
<tr><td>"We have a website."</td><td><span class="say">"Great. Can guests book and pay a deposit on it? That's the part I add."</span></td></tr>
<tr><td>"Sounds like hassle."</td><td><span class="say">"None for you. I set it all up and look after it."</span></td></tr>
<tr><td>"Ring me in the new year."</td><td><span class="say">"Sure, what date in January?"</span> Write <b>J</b> + date.</td></tr>
<tr><td>"How do I know it'll work?"</td><td><span class="say">"If it brings no booking by 30 June, your monthly support is free until it does."</span></td></tr>
</table></div>
{OFFER_BOX}
<div class="box blue"><h2>After a YES: send Claude one message</h2>
<p style="margin:0" class="say">"[Business] said yes. Booking.com link: … Room prices: … OK to use their photos: yes/no. Visit on [day]."</p>
<p style="margin:2px 0 0">Claude updates their sample before your visit.</p></div>
{CODES}
<div class="money"><div>€1,065 by 20 Dec<small>3 × €285 deposits + 1 × €210</small></div><div>≈ 30 calls<small>about 1 in 8 says yes</small></div></div>
</div></div>
<footer>Be friendly, be brief, take "no" well. Every "ring me in January" is money in the new year.</footer>
</div></body></html>"""

# ---------------------------------------------------------------- Sheet 2 (Days 1-2 + visits)
s2 = head('Sheet 2: Days 1–2') + f"""
{REMIND}
<div class="cols"><div>
{calls('Day 1: Spiddal · Bearna · Moycullen', [
 ('Teach na Mara', '091 553 047', '"Your villa has glowing reviews on VRBO and fivestar.ie. At about €4,000 a week, one booking direct pays for the website."', '570', '<div class="url">Sample: …/sites/teach-na-mara</div>'),
 ('Ardmor Country House', '091 553 145', '<b>Speak Irish, be warm.</b> "Guests who click your website on Discover Ireland land on a farm-holidays listing, not your own site."', '570', '<div class="url">Sample (Irish): …/sites/ardmor-country-house/ga</div>'),
 ('Radharc Árainn (Aran View)', '091 553 632', '"You have over 800 reviews on the booking sites. That\'s a lot of commission paid."', '570', '<div class="url">Sample: …/sites/radharc-arainn-bnb</div>'),
 ('Briseadh na Carraige', '091 553 212', '"You\'re rated 4.9 on Google but only 16 guests have reviewed you there. I can get you more reviews and direct bookings."', '570', '<div class="url">Sample: …/sites/briseadh-na-carraige-bnb</div>'),
 ('Rockfield House', '091 555 586', '"A guest called your farmhouse a fairy house. The booking sites can\'t tell that story." A page about the farm + your Google Maps listing.', '210', '<div class="url">Sample: …/sites/rockfield-house</div>'),
 ('Villa De Porres', '091 592 239', '<span class="chk">Look at villadeporresbandb.com first.</span> If guests can\'t book on it: "Your dog-friendly B&B is rare. I can add booking to your website."', '570'),
 ('Freeport House', '091 592 199', '<span class="chk">Look at freeport-house.com first.</span> "Guests love your sea views, but your website doesn\'t show them off on a phone."', '570'),
])}
<p class="url" style="margin:-3px 0 6px">Every sample link starts with <b>{SITE}</b>. Add <b>/ga</b> for Irish.</p>
</div><div>
{calls('Day 2: Oughterard', [
 ('Riverwalk House', '091 552 788', '"You\'re Fáilte Ireland 4-star but have no website of your own. Anglers and walkers Google your name."', '570'),
 ('Carrown Tober House', '091 552 166', '"4.8 on Google from 168 reviews, but no website of your own."', '570'),
 ('Mountain View Guesthouse', '091 550 306', '"Guests rate you 9.8 on Expedia, but you have no website of your own."', '570'),
 ('Crossriver B&B', '091 552 676', '"20 years running and guests love breakfast in your sunroom." A simple page + your Google Maps listing.', '210'),
])}
""" + VISITS + CODES + """
</div></div>
<footer>The script, answers and the offer are on Sheet 1. Be friendly, be brief, take "no" well.</footer>
</div></body></html>"""

# ---------------------------------------------------------------- Sheet 3
s3 = head('Sheet 3: Days 3–6') + f"""
{REMIND}
<div class="goal">Same steps as Sheet 1. <b>Two differences:</b> these places have no sample yet, so ask <b>"Could I make you a free sample?"</b> And for far-away places, show the sample on a <b>WhatsApp video call</b>.</div>
<div class="cols"><div>
<div class="box gold"><h2>How to read this sheet</h2><ul>
<li><span class="offer">€570 Get Booked</span> booking website · <span class="offer f">€210 Get Found</span> Google + one page · <span class="offer s">€90/mo support</span> they already take bookings online, so offer monthly support: 4 Google posts a month, replies to reviews, small changes.</li>
<li><span class="chk">"Look first"</span> means they have a website. Open it on your phone. Only pitch if guests can't book on it, or it looks old.</li>
<li>On a YES: message Claude. The sample is ready the same day.</li></ul></div>
{calls('Day 3: Aran Islands', [
 ('Dormer House', '099 61125', '"A guest review says you don\'t have a website, so people have to ring to book. I can make one where they book and pay a deposit."', '570'),
 ('Claí Bán', '099 61111', '"The ferry company lists you among the best stays on Inis Mór, but guests can\'t book you on a website of your own."', '570'),
 ('Rooms @ An Móinéar', '099 75960', '<span class="chk">Look first.</span> "Guests rate you 5.0 and rave about breakfast."', '570'),
 ('Tigh Ruairí', '099 75002', '<span class="chk">Look at tighruairi.com first.</span> "I can reply to your reviews and post on your Google listing every week."', 'sup'),
])}
{calls('Day 4: Roundstone · Carna', [
 ('Wits End', '095 35813', '"Rated 5.0 on Google with views over Roundstone Bay, but no website of your own."', '570'),
 ('Sonas B&B', '095 32277', '"You\'re in the heart of the Carna Gaeltacht but only on Airbnb." Offer Irish.', '570'),
 ('Sea-Side B&B', '095 32030', '<span class="chk">Check it\'s still open.</span> "A page for your sea views + your Google Maps listing."', '210'),
 ('Island View House', '095 35701', '<span class="chk">Look first.</span> "Guests love your scones and the bay views."', '570'),
 ('Seagrove House', '095 35810', '<span class="chk">Look first.</span> "Guests love your views of the Twelve Bens."', '570'),
 ('Atlantic Wave House', '095 32269', '<span class="chk">Look first.</span> "Guests love your sea views and the beach."', '570'),
])}
</div><div>
{calls('Day 5: Clifden · Letterfrack', [
 ('Clifden Farmhouse B&B', '095 21263', '"Guests love your welcome and the short walk into Clifden, but I couldn\'t find a website for you."', '210'),
 ('Ben View House', '095 21256', '<span class="chk">Look first.</span> "Your family has run Ben View since 1926."', '570'),
 ('Kingstown House', '095 21470', '<span class="chk">Look first.</span> "Guests rave about your breakfasts."', '570'),
 ('Hillside Lodge', '095 21463', '<span class="chk">Look at hillside-lodge.com first.</span> Offer review replies + Google posts.', 'sup'),
 ('Mallmore Country House', '095 21460', '<span class="chk">Look first.</span> Offer review replies + Google posts.', 'sup'),
 ('Ardmore House (Clifden)', '095 21221', '<span class="chk">Look first.</span> "Guests rate you 9.8 for the cliff walk and views."', '570'),
 ('All the Twos Lodge', '095 22222', '"Over 1,000 reviews on the booking sites. I can reply to them and post on your Google listing."', 'sup'),
 ('Letterfrack Lodge', '095 41222', '<span class="chk">Look first.</span> "Hikers for Diamond Hill book you on Booking.com and Hostelworld. Let them book you directly."', '570'),
])}
{calls('Day 6: Hotels (Spiddal)', [
 ('Park Lodge Hotel', '091 553 159', '"Parents visiting Coláiste Lurgan stay in your chalets. A booking page just for them, ready for summer."', '570'),
 ('An Cruiscín Lán', '091 553 148', '"You already take bookings online. I can reply to your reviews and post your menus and specials on Google every week."', 'sup'),
])}
<div class="box blue"><h2>Day 5 too: follow up</h2><p style="margin:0">Send this to everyone who saw a sample and agreed to messages:<br><span class="say">"Hi [name], just checking you got a chance to look at the sample. I have space for one more client at the launch price before Christmas. Shall I keep it for you?"</span></p></div>
{CODES}
</div></div>
<footer>The script, answers and the offer are on Sheet 1. One yes a week is a good week.</footer>
</div></body></html>"""

open(os.path.join(ROOT, 'docs/call-cheat-sheet.html'), 'w').write(s1)
open(os.path.join(ROOT, 'docs/call-cheat-sheet-2.html'), 'w').write(s2)
open(os.path.join(ROOT, 'docs/call-cheat-sheet-3.html'), 'w').write(s3)
print('wrote both sheets')
