# Book Direct Connemara

This repo holds your business website, a template that turns out a client site from one file, three demo sites, and the paperwork. You don't need a domain: it's hosted free on Vercel (with GitHub Pages as a backup copy).

**Live site:** https://bookdirectconnemara.vercel.app/ (Irish: `/ga/`)

Backup copy: https://dejia123.github.io/connemara-web-studio/

👉 **Start with [`docs/TODAY.md`](docs/TODAY.md).** It lists the things only you can do: your details, Stripe, Revenue and your Google profile.

## What's here

| Path | What it is |
|---|---|
| `studio.json` | **Your details**: name, phone, WhatsApp, email, Stripe links, founding places left |
| `clients/demo-*.json` | 3 demo sites for made-up businesses (B&B, café, electrician), shown on your homepage |
| `clients/<prospect>.json` | Starter samples for Day-1 calls. They are drafts and not published |
| `clients/_TEMPLATE-*.json` | The templates that `new-sample.mjs` copies |
| `docs/` | Today's checklist, contract, discovery-call and demo routine, client content checklist |
| `tools/invoice.html` | Open it in a browser, click to edit, print to PDF |
| `src/`, `assets/` | The engine. You shouldn't need to touch it |

## Make a free sample (about 30–60 minutes)

```bash
node new-sample.mjs "Ardmor Country House" --area "Spiddal, Co. Galway" --phone "091 553 145"
```

Open `clients/ardmor-country-house.json` and fill in anything marked `TODO` (for example, room prices from their Booking.com page). Options: `--type bnb|cafe|trades`, `--theme atlantic|heather|bog|stone|turf`.

To preview it:

```bash
node build.mjs --serve
```

Then open http://localhost:8080/sites/ardmor-country-house/ (and `/ga/` for Irish).

To publish it, commit and push. About a minute later it's live at
`https://bookdirectconnemara.vercel.app/sites/ardmor-country-house/`.

Every sample shows a banner saying "Sample website prepared for …" and is hidden from Google. Its booking form only *shows* the message the owner would get; nothing is sent.

## Turn a sample into the client's real site

In the client's JSON file:

1. Remove `"sample": true`. This takes away the banner, makes the form send for real and lets Google index the site.
2. Set `"whatsapp"` (the owner's mobile, in the form `353…`) and/or `"email"`, so booking requests reach them.
3. Add `"booking": { "depositLink": "<their Stripe payment link>" }`.
4. Photos: put them in `clients/photos/<slug>/` and list them under `"photos"`. The first is the big top image, the second goes with the "about" text, and the rest form a gallery. Each room can take its own `"photo"`.
5. **Full calendar sync with Booking.com and Airbnb:** sign the client up for a booking engine with a channel manager, such as Beds24 (from about €15 a month, with iCal sync). Then set `"booking": { "mode": "embed", "embedUrl": "<their booking page URL>" }`, and their live calendar replaces the form.
6. Their own domain is optional and the client pays for it; you add a `CNAME` file when they have one. Until then the site lives at your free address.

## Booking requests with no server

By default, forms open **WhatsApp** with the request already typed out, or email if there's no WhatsApp number. If you'd rather get requests in an inbox, create a free form at formspree.io or web3forms.com and paste its URL as `"formEndpoint"`.

## Irish

The Irish text was written carefully, but **have a native speaker read it once** before you show it to Gaeltacht owners. They will notice mistakes. The text is in `src/i18n.mjs`, `src/studio-site.mjs` and each client's JSON file.

## Commands

```bash
node build.mjs            # build dist/ (drafts skipped)
node build.mjs --drafts   # include drafts so you can preview them
node build.mjs --serve    # build and serve on :8080
```

You need Node 18 or newer. There's nothing to install: the project has no dependencies.
