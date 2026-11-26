# Card payments + live availability on a client's website

Two parts, both one-time:
- **Live availability calendar:** guests see which nights are free and book instantly. Section A.
- **Card payments (Stripe):** guests pay on the website and the money goes to the owner. Section B (below).

## A. Live availability calendar (about 15 minutes, you do it)

The calendar on the website reads the owner's **Airbnb** and **Booking.com** calendars, plus bookings paid on the website.
Website bookings are sent back to Airbnb and Booking.com, so **nobody can book the same night twice**.
When a guest checks out, their nights are in the past, so the room shows free again automatically.

**1. Get each room's calendar link from Airbnb** (you need to be logged in to the owner's Airbnb, so do it with them):
Airbnb → Menu → **Calendar** → pick the listing → **Availability** → **Connect calendars** (or "Sync calendars") → **Export calendar** → copy the link (`https://www.airbnb.com/calendar/ical/50556618.ics?s=…`).
Do this for each listing (Room 1, Room 3, Family Room).

**2. Same on Booking.com** (if the owner uses it): Extranet → **Rates & Availability** → **Sync calendars** → **Export calendar** → copy the link for each room.

**3. In Vercel** → Settings → Environment Variables, add `CAL_CLIFDEN_FARMHOUSE` with (one line):
```
{"room1":["<Airbnb link Room 1>","<Booking.com link Room 1>"],"room3":["<Airbnb link Room 3>"],"room4":["<Airbnb link Family Room>"]}
```
(`room1`, `room3`, `room4` are the `"id"`s in `clients/clifden-farmhouse.json`.) Keep these links private: anyone with them can see the calendar.

**4. Send website bookings back to Airbnb / Booking.com.** In the same "Connect calendars" screen choose **Import calendar** and paste:
- Room 1: `https://bookdirectconnemara.vercel.app/api/calendar?slug=clifden-farmhouse&room=room1`
- Room 3: `…&room=room3`  ·  Family Room: `…&room=room4`

Name it "Website". Airbnb and Booking.com re-read it every few hours. Our website reads their calendars every 2 minutes,
and re-checks just before taking a payment, so a guest can never pay for a night that's already taken.

**Good to know:**
- If a calendar link ever stops working, the website stops taking instant bookings and asks guests to ring Mary first. It never shows a booked night as free.
- Phone bookings: the owner blocks the dates on Airbnb as they do today, and the website picks that up by itself.
- The small gap: Airbnb only re-reads the website calendar every few hours. A rare double booking is possible if someone books the same room on Airbnb within that time. To close the gap fully, use a channel manager such as Beds24 (about €15/month).

---

# B. Card payments (Stripe)

Guests pay by card on the B&B's own website (Visa, Mastercard, Apple Pay, Google Pay), as on Airbnb.
The money goes **straight into the owner's bank account**. No card machine needed.

**How it works for the guest (Clifden Farmhouse):** pick room and dates on the live calendar (booked nights crossed out) →
tap **"Pay €175 securely by card"** → Stripe's secure payment page → back to Mary's site with "Thank you! Your payment has been received."

The price is worked out on the server from the client's file (`clients/<slug>.json`), so a guest cannot change it.
The code is `api/checkout.js`.

---

## The 2-minute way (recommended): the owner just taps a link

You set this up **once for your studio** (about 15 minutes). After that, each owner gets a link,
taps it on their phone, and card payments switch on by themselves. No Stripe dashboard, settings or keys for the owner.

### Once, for your studio (you)
1. Log in to **your** Stripe account (Book Direct Connemara) → **Connect** → Get started → choose **Express** accounts.
   Answer the platform questions (you build websites with booking for B&Bs; the B&B owners are paid directly).
2. Connect → Settings → **Branding**: name "Book Direct Connemara", your icon, colour `#36543b`.
   This is what owners see on the Stripe form, so it looks friendly and familiar.
3. Developers → API keys → copy the **Secret key** (`sk_live_…`).
4. **Vercel** → Settings → Environment Variables (Production):
   - `STRIPE_PLATFORM_KEY` = that secret key
   - `ONBOARD_KEY` = a long password you make up (it protects your setup page)
   Then Deployments → Redeploy.
5. Stripe → Settings → **Emails**: turn on **Successful payments** (you get an email for every booking paid)
   and **Customer emails → Successful payments** (the guest gets a receipt).

### For each owner (them: about 2 minutes)
1. Open **your setup page** on your phone:
   `https://bookdirectconnemara.vercel.app/api/onboard?slug=clifden-farmhouse&key=YOUR-ONBOARD_KEY`
2. Tap **Send to Mary by WhatsApp** (or text, or "Open it on this phone" and hand her your phone).
3. Mary taps the link. Her B&B's details are already filled in. She adds:
   the code Stripe texts to **her mobile**, date of birth, home address, **bank IBAN**, and a photo of her ID only if Stripe asks.
4. She lands on "Thank you, Mary! You're all set." Your setup page shows **✓ Card payments ON**.
   From that moment the card button appears on her website by itself.

**Have ready:** Mary's mobile phone (Stripe texts a code; a landline can't receive it), and her bank card/IBAN.

### Good to know
- Until Mary's setup is finished and approved, the website **hides** the card button and shows bank transfer / "Call Mary" instead,
  so guests never see an error.
- **Booking notices:** you get Stripe's email for every payment (room, dates, guest name and phone). The nights are also
  blocked on Airbnb/Booking.com automatically (section A). Ring or text Mary about new bookings,
  or, once she has an email/mobile, ask for an automatic booking notice to her to be added.
- With this kind of setup Stripe treats you as the "platform": if a guest disputes a payment and the owner's balance can't cover it,
  Stripe can recover it from your account. This is rare for B&B bookings. Keep the owner's refund policy clear on the site.
- Payouts go to the owner's bank automatically. Refunds: your Stripe dashboard → Payments → the payment → Refund.
- Fees: roughly 1.5% + 25c per European card (check stripe.com/ie/pricing). No monthly fee. Airbnb takes about 15%.
- You can later charge your monthly fee through the same system (Stripe "application fee"). Ask when you want it.

## Alternative: the owner has their own Stripe account (more work for them)

Only if an owner already uses Stripe. They sign up at dashboard.stripe.com, then in **their** account:
Developers → API keys → **Create restricted key** with **Checkout Sessions: Write**. Put it in Vercel as
`STRIPE_KEY_CLIFDEN_FARMHOUSE` (`STRIPE_KEY_` + slug in capitals, `-` → `_`). This takes priority over the 2-minute way.

## Test before going live
- Use test keys (`sk_test_…`) first, and the test card `4242 4242 4242 4242`, any future date, any CVC.
- Then, live: book 1 night yourself with your own card, check it appears on the calendar, then refund it.
- Remove `"sample": true` from the client file to go live (commit and push).

## To add card payments for another client

1. In `api/_lib.js`, add a line to `SITES`, e.g. `'teach-na-mara': require('../clients/teach-na-mara.json'),`
2. In their JSON: `"booking": { "mode": "call", "cardPayments": true, "liveAvailability": true }`, each room an `"id"`, and rooms need a `"price"` (optional `"priceHigh"` + `"highMonths": [7, 8]`).
3. Open your setup page with `slug=<their slug>` and send them their link.

---

# C. Bank transfer (no payment company, nothing for the owner to sign up to)

Guests can also pay by bank transfer straight into the owner's account. All you need from them is their **account name, IBAN and BIC**
(on their bank card letter, or in their banking app under "account details").

In `clients/clifden-farmhouse.json`, fill in:
```
"bankTransfer": { "accountName": "…", "iban": "IE.. .... .... .... .... ..", "bic": "…", "refPrefix": "CF" }
```
The guest sees: **1. Ring Mary to hold your room. 2. Send €X to:** her details, plus a reference like **CF R1 18APR**
(room 1, arriving 18 April), so she can tell from her bank statement which booking was paid. Each detail has a Copy button.

Bank transfer can't confirm a booking by itself (the website can't see her bank account), so the guest rings first to hold the room,
and the owner blocks the dates on Airbnb as she does for any phone booking.

## If Stripe is too much hassle: run the site with bank transfer only

Set `"cardPayments": false` in the client file. The card button disappears and "Pay by bank transfer" shows open in its place.
The live calendar still works (it only needs the Airbnb / Booking.com links from section A).
Card payments can be switched on later at any time: set `"cardPayments": true` and do section B.
