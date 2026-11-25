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
  .stt{font-size:7.6pt;font-weight:800;margin:2px 0 1px;padding:1px 5px;border-radius:3px;display:inline-block}
  .stt.done{background:#eceff1;color:#5a6870}.stt.again{background:#e8f0f4;color:#17506b}.stt.cb{background:#fff3e0;color:#8a4b00;border:1px solid #e0a040}.stt.wait{background:#f3eef7;color:#5d3d78}.stt.hot{background:#e6f4ea;color:#1f6b3e;border:1.3px solid #2e8b57}
  tr.done td{opacity:.42}tr.done .hook{display:none}tr.done b{text-decoration:line-through}
  .tick.on{background:#14212b}
  .smp{display:inline-block;font-size:7pt;font-weight:800;border-radius:3px;padding:0 4px;margin-left:3px;vertical-align:1px}.smp.ok{background:#e6f4ea;color:#1f6b3e;border:1px solid #2e8b57}.smp.no{background:#fff3e0;color:#8a4b00;border:1px solid #e0a040}
  .obj td:first-child{width:33%;font-weight:700}
  .money{display:flex;gap:5px;text-align:center;font-weight:800;font-size:10pt}
  .money div{flex:1;border:1.5px solid #17506b;border-radius:5px;padding:2px;background:#fff}
  .money small{display:block;font-weight:400;font-size:7.2pt;color:#44535c}
  .codes{display:grid;grid-template-columns:auto 1fr;gap:1px 7px;font-size:8pt}
  .codes b{color:#17506b}
  footer{font-size:7.2pt;color:#6b777e;text-align:center;margin-top:1px}
  @media screen{body{background:#e9edef;padding:16px}.page{background:#fff;padding:10mm;box-shadow:0 8px 30px rgba(0,0,0,.12)}}
</style>"""

OFFER = {'570': ('€570 website', ''), '210': ('€570 website', ''), 'sup': ('€90/mo Growth', 's')}


def head(title):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title} · Book Direct Connemara</title>{STYLE}</head><body><div class="page">
<header><h1>{title} <span>· Book Direct Connemara</span></h1><div class="me"><b>{ME}</b> · {PHONE}<br>{SITE}</div></header>"""


STATUS = {
  # name: (kind, text)   kind: done | again | wait | hot | cb
  'Teach na Mara': ('again', '24 Nov: no answer. Ring again'),
  'Ardmor Country House': ('again', '24 Nov: no answer. Ring again'),
  'Radharc Árainn (Aran View)': ('cb', '24 Nov: asked for a call back. RING WED 25 NOV'),
  'Briseadh na Carraige': ('again', '24 Nov: voicemail left. Ring again Thu 26 Nov'),
  'Rockfield House': ('done', '24 Nov: no longer in business'),
  'Villa De Porres': ('wait', '24 Nov: will ring back if her husband agrees'),
  'Freeport House': ('done', '24 Nov: number not working'),
  'Riverwalk House': ('hot', '24 Nov: INTERESTED. Sample sent, book the visit'),
  'Carrown Tober House': ('done', '24 Nov: already has a web developer'),
  'Mountain View Guesthouse': ('done', '24 Nov: not interested. Never contact again'),
  'Crossriver B&B': ('done', '24 Nov: already has a web developer'),
  'Dormer House': ('done', '24 Nov: number not working'),
  'Claí Bán': ('again', '24 Nov: no answer. Ring again'),
  'Rooms @ An Móinéar': ('again', '24 Nov: no answer. Ring again'),
}

def calls(title, rows, first_col='Business · number · what to say', show_sample=False):
    out = [f'<div class="box"><h2>{title}</h2><table class="calls"><tr><th></th><th>{first_col}</th><th class="res">Result</th></tr>']
    for r in rows:
        name, num, hook, offer = r[:4]
        extra = r[4] if len(r) > 4 else ''
        label, cls = OFFER[offer]
        st = ''
        if show_sample:
            st = '<span class="smp ok">✓ SAMPLE READY</span>' if 'Sample' in extra else '<span class="smp no">NO SAMPLE: ask "Could I make you one?"</span>'
        kind, note = STATUS.get(name, ('', ''))
        stt = f'<div class="stt {kind}">{note}</div>' if note else ''
        res = {'done': 'N', 'again': 'NA', 'cb': 'CB', 'wait': 'CB', 'hot': 'Y'}.get(kind, '')
        if 'voicemail' in note: res = 'VM'
        if 'not working' in note or 'no longer' in note: res = '✗'
        out.append(f'<tr class="{"done" if kind == "done" else ""}"><td><span class="tick{" on" if kind else ""}"></span></td><td><b>{name}</b> <span class="num">{num}</span><span class="offer {cls}">{label}</span>{st}'
                   f'{stt}<div class="hook">{hook}</div>{extra}</td><td class="res"><b>{res}</b></td></tr>')
    out.append('</table></div>')
    return ''.join(out)


CODES = """<div class="box gold"><h2>Write one code in "Result"</h2><div class="codes">
<b>Y</b><span>Yes: link sent, visit or video call booked</span>
<b>NA</b><span>No answer: try again at a different time</span>
<b>VM</b><span>Voicemail left: try again on [day]</span>
<b>CB</b><span>Call back on [date + time]</span>
<b>J</b><span>"Ring me in January": write the date</span>
<b>N</b><span>Not interested: never contact again</span>
<b>✗</b><span>Number not working, or closed</span></div></div>"""

OFFER_BOX = """<div class="box blue"><h2>The offer (when they like the sample)</h2>
<div class="money"><div>€570<small>launch price (normally €950)</small></div><div>€285<small>now, to start</small></div><div>€285<small>when it's online</small></div></div>
<ul style="margin-top:4px">
<li>Or <b>3 payments of €190</b>. Launch price for the first 3 clients, until <b>20 December</b>.</li>
<li><b>"Too much up front?"</b> Offer: <b>nothing up front, €39 a month</b> (12 months minimum, support included). After 15 payments the website is theirs. Push the €570 first: deposits are your December money.</li>
<li>Online by <b>1 March</b>, or they get the deposit back.</li>
<li>No direct booking from the website by 30 June 2027? They <b>pay nothing for monthly support</b> until there is.</li>
<li>Payment: bank transfer is fine. <b>Ask Claude for the invoice.</b></li></ul></div>"""

REMIND = """<div class="box gold" style="display:flex;gap:10px;align-items:center;justify-content:space-between;font-size:8.6pt"><span><b>1</b> Hello → <b>2</b> their line + 15% → <b>3</b> "Can I send you a free sample?" → <b>4</b> book a day and time</span><span><b style="color:#1f6b3e">YES:</b> send link, message Claude · <b style="color:#9a3a28">NO:</b> thank them, next</span></div>"""

VISITS = """<div class="box"><h2>Visit in person (mobile numbers: never ring)</h2><table class="calls"><tr><th></th><th>Business · where · what to say at the door</th><th class="res">Result</th></tr>
<tr><td><span class="tick"></span></td><td><b>Lig do Scíth</b> · Carraroe South<span class="offer">€570 website</span><div class="hook"><b>Start with "Dia duit!" and bring the Irish sample.</b> "Hundreds of great reviews but no website of your own. I made you this sample." Or 3 × €190.</div></td><td class="res"></td></tr>
<tr><td><span class="tick"></span></td><td><b>Seaview Lodge</b> · Inverin<span class="offer">€570 website</span><div class="hook">"Cyclists love you on Hostelworld. Let groups book beds directly."</div></td><td class="res"></td></tr>
<tr><td><span class="tick"></span></td><td><b>Teach an tSailín</b> · Inverin<span class="offer">€570 website</span><div class="hook"><span class="chk">Check it still takes guests.</span> "You're on Google Maps with no photos or website. I can make you a booking website."</div></td><td class="res"></td></tr>
<tr><td><span class="tick"></span></td><td><b>Hollybanks</b> · Moycullen<span class="offer">€570 website</span><div class="hook">"Guests rave about your Connemara tips. Let them book you directly."</div></td><td class="res"></td></tr>
<tr><td><span class="tick"></span></td><td><b>Portarra Lodge</b> · Moycullen<span class="offer">€570 website</span><div class="hook"><span class="chk">Might be sold: check first.</span> "Anglers love your lakeside spot."</div></td><td class="res"></td></tr>
</table><p class="hook" style="margin:3px 0 0">Ask Claude for their sample the day before, and bring it on your phone.</p></div>
"""


# ---------------------------------------------------------------- Follow-ups (front page)
s0 = head('Follow-ups: week of 24 November').replace('</head>', '<style>body{font-size:9.6pt}.box{margin-bottom:9px}.fl td{padding:5px 4px}.fl td.n2{white-space:nowrap;font-weight:700}</style></head>') + f"""
<div class="goal"><b>Start here.</b> Do these in order, then carry on with the new calls on Sheet 3. &nbsp;So far: 14 calls · <b>1 hot lead</b> · 1 call-back.</div>
<div class="cols"><div>
<div class="box" style="border:2px solid #2e8b57;background:#f3faf5"><h2 style="color:#1f6b3e">1. Hot lead: Riverwalk House · 091 552 788</h2>
<p style="margin:0 0 4px">Hosts: <b>Ann and Patrick</b> (check names). Fáilte Ireland 4★, 9.6 on Booking.com. <span class="url">…/sites/riverwalk-house</span></p>
<div class="step"><span class="n">1</span><p><span class="t">Send the link</span><br><span class="say">"Hi Ann, it's Ayodeji from Book Direct Connemara. As promised, here's the free sample I made for Riverwalk House: [link]. Could I give you a quick 5-minute call tomorrow to walk you through it? What time suits?"</span></p></div>
<div class="step"><span class="n">2</span><p><span class="t">On the call: let them look</span><br><span class="say">"Have you got it open? Scroll down slowly."</span> Point out: their names, the <b>9.6 rating</b>, the <b>guest quotes</b>, the booking form, the Irish version. <span class="say">"The room photos are placeholders. I'll put your own rooms in."</span></p></div>
<div class="step"><span class="n">3</span><p><span class="t">Their own numbers</span><br><span class="say">"Open bookdirectconnemara.vercel.app and put your room price and your Booking.com nights into the calculator."</span> Let them read the saving.</p></div>
<div class="step"><span class="n">4</span><p><span class="t">The offer, then stop talking</span><br><span class="say">"It's €570 instead of €950 for my first three. €285 to start, the rest when it's online. Or 3 × €190, or €39 a month with nothing up front. Will I put you down as one of my first three?"</span></p></div>
<p style="margin:2px 0"><b style="color:#1f6b3e">YES:</b> <span class="say">"Great, I'll send you the invoice today."</span> Ask: rooms, prices, OK to use Booking.com photos. Then message Claude.<br><b style="color:#8a4b00">"Let me think":</b> <span class="say">"Of course. Shall I ring you on [day]?"</span> Write it down.</p></div>

<div class="box" style="border:2px solid #e0a040;background:#fffaf0"><h2 style="color:#8a4b00">2. Call back: Wednesday 25 Nov</h2>
<table class="fl"><tr><td><span class="tick"></span></td><td><b>Radharc Árainn (Aran View)</b></td><td class="n2">091 553 632</td></tr>
<tr><td></td><td colspan="2">They asked you to ring back. <b>✓ Sample ready.</b> Open with: <span class="say">"Hi, it's Ayodeji, you asked me to ring back today about the free sample website."</span></td></tr></table></div>

<div class="box"><h2>3. Waiting</h2>
<table class="fl"><tr><td><span class="tick"></span></td><td><b>Villa De Porres</b> · 091 592 239</td></tr>
<tr><td></td><td>Will ring back if her husband agrees. No word by <b>Tue 1 Dec</b>? One friendly call, then leave it.</td></tr></table></div>
</div><div>
<div class="box blue"><h2>4. Ring again (try a different time)</h2>
<p style="margin:0 0 4px">Rang in the morning? Try <b>2–4pm</b> this time, or the other way round. Say: <span class="say">"Hi, it's Ayodeji, a local web developer. I tried you on Tuesday…"</span> then Sheet 1.</p>
<table class="fl">
<tr><td><span class="tick"></span></td><td><b>Teach na Mara</b> <span class="smp ok">✓ SAMPLE READY</span></td><td class="n2">091 553 047</td></tr>
<tr><td><span class="tick"></span></td><td><b>Ardmor Country House</b> <span class="smp ok">✓ SAMPLE READY</span> (Irish)</td><td class="n2">091 553 145</td></tr>
<tr><td><span class="tick"></span></td><td><b>Briseadh na Carraige</b> <span class="smp ok">✓ SAMPLE READY</span><br><small>Voicemail left. Ring <b>Thu 26 Nov</b>: "I left you a message on Tuesday…"</small></td><td class="n2">091 553 212</td></tr>
<tr><td><span class="tick"></span></td><td><b>Claí Bán</b> (Inis Mór)</td><td class="n2">099 61111</td></tr>
<tr><td><span class="tick"></span></td><td><b>Rooms @ An Móinéar</b> (Inis Oírr)</td><td class="n2">099 75960</td></tr>
</table><p style="margin:4px 0 0" class="hook">Three tries with no answer? Mark N and move on.</p></div>

<div class="box"><h2>5. New calls next</h2><ul>
<li><b>Sheet 3, Day 3:</b> Tigh Ruairí (099 75002). The others there are done or on this page.</li>
<li><b>Sheet 3, Day 4:</b> Roundstone and Carna (6 calls), then Day 5 and Day 6.</li>
<li><b>Visits</b> (Sheet 2, bottom right): 5 places with mobile numbers. Go when you're out that way. Ask Claude for their sample the day before.</li></ul></div>

<div class="box" style="background:#f4f5f6"><h2 style="color:#5a6870">Done: don't call again</h2>
<p style="margin:0;color:#5a6870">Rockfield House (closed) · Freeport House and Dormer House (numbers not working) · Carrown Tober and Crossriver (already have a web developer) · Mountain View (not interested)</p></div>
</div></div>
<footer>One hot lead after one day is a good start. Keep going.</footer>
</div></body></html>"""

# ---------------------------------------------------------------- Sheet 1 (how to call)
s1 = head('Sheet 1 (front): On the phone').replace('</head>', '<style>body{font-size:9.2pt}.obj td{padding:3px 3px}.box{margin-bottom:7px}</style></head>') + f"""
<div class="goal">Your only goal on the phone: <b>get a YES to the free sample</b> and book a 5-minute look. Don't sell on the phone.<br><span style="font-size:8pt;opacity:.9">Target: <b>€1,000+ by 20 December</b> (4 deposits of €285 = €1,140). About 1 in 8 owners says yes, so keep dialling.</span></div>
<div class="cols"><div>
<div class="box gold"><h2>Before you dial</h2><ul>
<li><b>Only ring numbers starting 091, 095 or 099.</b> Never cold-call a mobile (08…): visit instead.</li>
<li>Best times: <b>Tue–Thu, 10:30–12:00 or 2–4pm</b>.</li>
<li>Only send a link or email <b>after they say yes</b> to it.</li></ul></div>

<div class="box"><h2>Say this, in this order</h2>
<div class="step"><span class="n">1</span><p><span class="t">Hello</span><br><span class="say">"Hi, is that [business]? My name is Ayodeji. I'm a web developer based locally. Have you got two minutes?"</span><br>Gaeltacht: start with <span class="say">"Dia duit!"</span> and mention the website comes in Irish and English.</p></div>
<div class="step"><span class="n">2</span><p><span class="t">Why you're calling</span><br>Read their line from Sheet 2 or 3, then:<br><span class="say">"Booking.com takes about 15% of every booking. You're allowed to offer a better price on your own website now."</span></p></div>
<div class="step"><span class="n">3</span><p><span class="t">The ask</span><br><b style="color:#1f6b3e">✓ Sample ready:</b> <span class="say">"I've already made you a free sample website. No cost, no catch. Can I send you the link on WhatsApp, and call in for five minutes to show you?"</span><br><b style="color:#8a4b00">No sample yet:</b> <span class="say">"Could I make you a free sample website? No cost, no catch. I'll have it ready in two days and call in for five minutes to show you."</span></p></div>
<div class="step"><span class="n">4</span><p><span class="t">Book a time</span><br><span class="say">"What day suits you, and what time?"</span> Write it down before you hang up.</p></div>
<div class="yn">
<div class="yes"><b class="h">IF YES</b><ol><li>Send the sample link on WhatsApp (or email)</li><li>Write <b>Y</b> + the day</li><li>Message Claude (see the back)</li></ol></div>
<div class="no"><b class="h">IF NO</b><ol><li><span class="say">"No problem at all, thanks for your time."</span></li><li>Write <b>N</b></li><li>Next call. Don't take it personally</li></ol></div>
</div></div>



<div class="box"><h2>Voicemail (only on 091/095/099 numbers)</h2>
<p style="margin:0" class="say">"Hi, this is Ayodeji, a local web developer. I make websites for B&Bs where guests book you directly, and I'd love to show you a free sample. I'll try you again on [day], or ring me on {PHONE}. Thanks!"</p></div>
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
<tr><td>"How do I know it'll work?"</td><td><span class="say">"If it brings you no direct booking by 30 June, you pay nothing for monthly support until it does."</span></td></tr>
<tr><td>"Why €570? What do I get?"</td><td><span class="say">"I build the whole thing for you: rooms, photos, prices, in Irish and English, with online booking and deposits, and your Google listing sorted. You own it."</span></td></tr>
<tr><td>"Who are you? Is this legit?"</td><td><span class="say">"I'm local, my website is bookdirectconnemara.vercel.app, and you see everything before you pay a cent."</span></td></tr>
</table></div>

</div></div>
<footer>Be friendly, be brief, take "no" well. Every "ring me in January" is money in the new year.</footer>
</div></body></html>"""


# ---------------------------------------------------------------- Sheet 1 back (at the visit)
s1b = head('Sheet 1 (back): At the visit').replace('</head>', '<style>body{font-size:9.6pt}.box{margin-bottom:9px}.step{margin-bottom:9px}</style></head>') + f"""
<div class="goal">At the visit your job is simple: <b>let them see their own website</b>, then ask for the yes.</div>
<div class="cols"><div>
<div class="box blue"><h2>At the visit (5 minutes)</h2>
<div class="step"><span class="n">1</span><p>Hand them your phone with <b>their sample</b> open. Let them scroll.</p></div>
<div class="step"><span class="n">2</span><p>Open <b>bookdirectconnemara.vercel.app</b>, scroll to the calculator, and let them type <b>their own</b> price and nights.</p></div>
<div class="step"><span class="n">3</span><p>Give the offer (on the right): <b>€570</b>, or 3 × €190, or €39 a month.</p></div>
<div class="step"><span class="n">4</span><p>Ask: <span class="say">"Will I put you down as one of my first three?"</span> Then stop talking.</p></div></div>

<div class="box gold"><h2>If they say yes at the table</h2><ul>
<li>Say: <span class="say">"Great. I'll send you the invoice for the €285 deposit today."</span></li>
<li>Message Claude: <span class="say">"[Business] said yes, €570" (or €39 a month)</span>. You'll get the invoice wording and the contract.</li>
<li>Bank transfer is fine for the deposit.</li>
<li>Tell Claude, so the "places left" number on your website goes down by one.</li></ul></div>
<div class="box"><h2>If they say "let me think about it"</h2><ul>
<li><span class="say">"Of course. The launch price is for my first three, until 20 December. Shall I give you a ring on [day]?"</span></li>
<li>Write <b>CB</b> + the day on your list. Leave the sample online so they can show it to family.</li></ul></div>
</div><div>
{OFFER_BOX}
<div class="box blue"><h2>After a YES on the phone: message Claude</h2>
<p style="margin:0" class="say">"[Business] said yes. Booking.com link: … Room prices: … OK to use their photos: yes/no. Visit on [day]."</p>
<p style="margin:2px 0 0">Claude updates their sample before your visit.</p></div>
</div></div>
<footer>Be warm, be patient, and let the sample do the selling.</footer>
</div></body></html>"""

# ---------------------------------------------------------------- Sheet 2 (Days 1-2 + visits)
s2 = head('Sheet 2: Days 1–2') + f"""
{REMIND}
<div class="cols"><div>
{calls('Day 1: Spiddal · Bearna · Moycullen', show_sample=True, rows=[
 ('Teach na Mara', '091 553 047', '"Your villa has glowing reviews on VRBO and fivestar.ie. At about €4,000 a week, one booking direct pays for the website."', '570', '<div class="url">Sample: …/sites/teach-na-mara</div>'),
 ('Ardmor Country House', '091 553 145', '<b>Start with "Dia duit", be warm. Send the Irish sample.</b> "Guests who click your website on Discover Ireland land on a farm-holidays listing, not your own site."', '570', '<div class="url">Sample (Irish): …/sites/ardmor-country-house/ga</div>'),
 ('Radharc Árainn (Aran View)', '091 553 632', '"You have over 800 reviews on the booking sites. That\'s a lot of commission paid."', '570', '<div class="url">Sample: …/sites/radharc-arainn-bnb</div>'),
 ('Briseadh na Carraige', '091 553 212', '"You\'re rated 4.9 on Google but only 16 guests have reviewed you there. I can add direct booking, plus a card asking guests for a Google review."', '570', '<div class="url">Sample: …/sites/briseadh-na-carraige-bnb</div>'),
 ('Rockfield House', '091 555 586', '"A guest called your farmhouse a fairy house. The booking sites can\'t tell that story."', '210', '<div class="url">Sample: …/sites/rockfield-house</div>'),
 ('Villa De Porres', '091 592 239', '<span class="chk">Look at villadeporresbandb.com first.</span> If guests can\'t book on it: "Your dog-friendly B&B is rare. I can add booking to your website."', '570'),
 ('Freeport House', '091 592 199', '<span class="chk">Look at freeport-house.com first.</span> "Guests love your sea views, but your website doesn\'t show them off on a phone."', '570'),
])}
<p class="url" style="margin:-3px 0 6px">Every sample link starts with <b>{SITE}</b>. Add <b>/ga</b> for Irish.</p>
</div><div>
{calls('Day 2: Oughterard', show_sample=True, rows=[
 ('Riverwalk House', '091 552 788', '"You\'re Fáilte Ireland 4-star but have no website of your own. Anglers and walkers Google your name."', '570', '<div class="url">Sample: …/sites/riverwalk-house</div>'),
 ('Carrown Tober House', '091 552 166', '"4.8 on Google from 168 reviews, but no website of your own."', '570'),
 ('Mountain View Guesthouse', '091 550 306', '"Guests rate you 9.8 on Expedia, but you have no website of your own."', '570'),
 ('Crossriver B&B', '091 552 676', '"20 years running and guests love breakfast in your sunroom."', '210'),
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
<li><span class="offer">€570 website</span> their own booking website (or €39 a month) · <span class="offer s">€90/mo support</span> they already take bookings online, so offer monthly support: 4 Google posts a month, replies to reviews, small changes.</li>
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
 ('Sonas B&B', '095 32277', '"You\'re in the heart of the Carna Gaeltacht but only on Airbnb." Mention the Irish and English website.', '570'),
 ('Sea-Side B&B', '095 32030', '<span class="chk">Check it\'s still open.</span> "Guests love your sea views. Let them book you directly."', '210'),
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

open(os.path.join(ROOT, 'docs/follow-ups.html'), 'w').write(s0)
open(os.path.join(ROOT, 'docs/call-cheat-sheet.html'), 'w').write(s1)
open(os.path.join(ROOT, 'docs/call-cheat-sheet-1b.html'), 'w').write(s1b)
open(os.path.join(ROOT, 'docs/call-cheat-sheet-2.html'), 'w').write(s2)
open(os.path.join(ROOT, 'docs/call-cheat-sheet-3.html'), 'w').write(s3)
print('wrote both sheets')
