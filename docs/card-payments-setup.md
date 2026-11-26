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

**How it works for the guest (Clifden Farmhouse):** pick dates and room → ring Mary to check they're free →
tap **"Pay €175 securely by card"** → Stripe's secure payment page → back to Mary's site with "Thank you! Your payment has been received."

The price is worked out on the server from the client's file (`clients/<slug>.json`), so a guest cannot change it.
The code is `api/checkout.js`.

---

## What the owner has to do (one time, about 10 minutes, sit with them)

The law requires that whoever receives card payments proves who they are. Nobody can do this for them.
It's the same check Airbnb and Booking.com did when they first set up payouts.

They need:
- **An email address** (Stripe sends payment notices there)
- **Photo ID** (passport or driving licence)
- **Their bank account IBAN** (where the money goes)
- **A mobile phone** for the security code (or you set up an authenticator app for them)

Steps, on your laptop with them beside you:
1. Go to **dashboard.stripe.com/register** and sign up with **their** email.
2. Business type: **Individual / sole trader**. Industry: **Hotels, B&Bs and lodging**. Website: their site address.
3. Enter their name, date of birth, home address, IBAN, and take a photo of their ID when asked.
4. Done. From now on they do nothing.

## What you do (about 10 minutes)

1. **In their Stripe account:** Developers → API keys → **Create restricted key**.
   Name it `website`. Set **Checkout Sessions: Write** (this includes Read, which the calendar needs to see website bookings) and leave everything else at None. Copy the key (`rk_live_…`).
2. **In Vercel** (vercel.com → the `bookdirectconnemara` project → Settings → Environment Variables), add:
   - Name: `STRIPE_KEY_CLIFDEN_FARMHOUSE` (for another client: `STRIPE_KEY_` + their slug in capitals, `-` → `_`)
   - Value: the `rk_live_…` key. Environment: Production.
3. **In their Stripe account → Settings:**
   - *Business details → Public details*: business name "Clifden Farmhouse B&B", phone, so receipts look right.
   - *Emails*: turn on **Successful payments** (the owner gets an email for every payment, showing room, dates and guest phone)
     and **Customer emails → Successful payments** (the guest gets a receipt).
   - *Payouts*: automatic, daily.
4. **In `clients/clifden-farmhouse.json`:** remove `"sample": true` (the client file already has `"cardPayments": true`). Commit and push.
5. **Test it:** book a 1-night stay yourself with your own card, then refund it in Stripe (Payments → the payment → Refund).

To try it with no real money first, use a **test** restricted key (`rk_test_…`) and the test card `4242 4242 4242 4242`, any future date, any CVC.

## Day to day

- Every payment: the owner gets an email from Stripe, and the guest gets a receipt.
- **The owner still blocks the dates on Airbnb / Booking.com.** They confirmed the booking on the phone, so they already know.
- Refunds (cancellations): Stripe dashboard → Payments → Refund. You can do this for them.
- Fees: Stripe takes a small cut of each card payment, roughly 1.5% + 25c for European cards and more for cards from outside Europe (check stripe.com/ie/pricing). No monthly fee. Compare: Airbnb takes about 15%.

## To add card payments for another client

1. In `api/checkout.js`, add a line to `SITES`, e.g. `'teach-na-mara': require('../clients/teach-na-mara.json'),`
2. In their JSON: `"booking": { "mode": "call", "cardPayments": true, "liveAvailability": true }`, each room an `"id"`, and rooms need a `"price"` (optional `"priceHigh"` + `"highMonths": [7, 8]`).
3. Follow the steps above with their Stripe account.

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
