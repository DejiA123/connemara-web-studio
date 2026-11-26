# Card payments on a client's website (Stripe)

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
   Name it `website`. Set **Checkout Sessions: Write** and leave everything else at None. Copy the key (`rk_live_…`).
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
2. In their JSON: `"booking": { "mode": "call", "cardPayments": true }`, and rooms need a `"price"` (optional `"priceHigh"` + `"highMonths": [7, 8]`).
3. Follow the steps above with their Stripe account.
