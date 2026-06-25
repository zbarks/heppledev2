# Hepple Spirits — Brand Site + Stripe Shop + Analytics

Static marketing site for Hepple Spirits Company, now with a **live Stripe
checkout** and **PostHog analytics** wired in.

**Designed & built by [Barker Digital](https://barkerdigital.co.uk)**

---

## Stack

Pure HTML / CSS / JS on the front end — no framework, no build step. The only
server-side code is a handful of **Vercel serverless functions** in `/api`
(zero-config Node) that talk to Stripe, Supabase and PostHog. Secret keys never
touch the browser.

- Self-hosted Proxima Nova (OTF) — brand typography
- Hash router: `/`, `#/story`, `#/estate`, `#/craft`, `#/cocktails`, `#/visit`, `#/shop`, `#/shop/:slug`
- **localStorage cart** → **Stripe Checkout** (hosted, PCI-handled by Stripe)
- **PostHog** product/cart/checkout funnel analytics (client + server)
- **Supabase** order mirror so the Portal can track fulfilment

## How checkout works

```
Browser                         Vercel (/api)                 Stripe
───────                         ─────────────                 ──────
add to cart (localStorage)
click CHECKOUT  ───POST /api/checkout {items, ph_id}──▶
                                validate cart vs catalogue
                                build Checkout Session ──────▶ create session
                ◀──{ url }──────                       ◀───── session.url
redirect to Stripe ─────────────────────────────────────────▶ hosted pay page
                                                               (card, address…)
        ◀───────────── redirect back to /?checkout=success ───
show confirmation modal,
clear cart, capture('purchase')

                       Stripe ──POST /api/stripe-webhook──▶ verify signature
                                                            mirror order → Supabase
                                                            capture order_completed → PostHog
```

The **client only ever sends `{ slug, qty }`** — the real price is looked up
server-side in `api/_catalogue.js`, so prices can't be tampered with from the
browser.

## Project structure (new bits in **bold**)

```
.
├── index.html              # + PostHog snippet in <head>
├── styles.css              # + .checkout-confirm modal styles
├── app.js                  # + analytics capture(), startCheckout(), return handler
├── vercel.json
├── package.json            # + "stripe" dependency, node>=18 engine
├── .env.example            # ← template, copy & fill (never commit real keys)
├── supabase-schema.sql     # ← run in Supabase SQL editor
├── README.md
└── api/                    # ← Vercel serverless functions
    ├── _catalogue.js       #   server source-of-truth: products, prices, shipping
    ├── checkout.js         #   POST → creates Stripe Checkout Session
    └── stripe-webhook.js   #   Stripe → Supabase + PostHog (raw-body verified)
```

## Setup

### 1. Install + run locally

```bash
npm install          # pulls the stripe SDK for the functions
npx vercel dev       # runs the static site AND the /api functions locally
```

(`npx serve .` still serves the static site, but won't run `/api`.)

### 2. Environment variables

Copy `.env.example` → `.env.local` (local) or paste into
**Vercel → Settings → Environment Variables** (production). See that file for
the full annotated list. Minimum to take a payment:

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (`sk_test_…` / `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → your endpoint (`whsec_…`) |

Optional but recommended: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
(order mirror), `POSTHOG_API_KEY` (server-side order events).

### 3. Client-side PostHog key

Open `index.html`, find `window.__HEPPLE_POSTHOG__`, and replace
`__POSTHOG_PROJECT_KEY__` with your **public** PostHog project key (`phc_…`).
This key is browser-safe by design. If you leave the placeholder, PostHog
simply stays disabled — the site still works.

### 4. Stripe webhook

In Stripe → Developers → Webhooks → **Add endpoint**:

- **URL:** `https://<your-domain>/api/stripe-webhook`
- **Events:** `checkout.session.completed`, `checkout.session.async_payment_succeeded`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

### 5. Supabase (optional — needed for fulfilment tracking)

Create a project, then run `supabase-schema.sql` in the SQL editor. Put the
project URL + **service-role** key into the env vars. RLS is on and there are no
anon policies, so order data is server-only.

### 6. Stripe products (optional)

By default the server builds each line item's price inline from
`api/_catalogue.js`. If you'd rather manage prices in the Stripe dashboard,
create Products/Prices there and set `STRIPE_PRICE_<SLUG>` env vars (see
`.env.example` for the exact names).

### 7. Promo codes

Promo codes are defined in `PROMOS` in `api/_catalogue.js` and validated
server-side — the browser only forwards the code string, never decides the
discount. The shipped code is **`MYSCHOOL10`** (10% off + free UK delivery).

The percentage is realised one of two ways:

- **Stripe coupon (recommended).** Create a 10% coupon in Stripe (Product
  catalogue → Coupons), then set its id as an env var:
  `STRIPE_COUPON_MYSCHOOL10=<coupon id>`. The discount then shows as a proper
  promotion in the Stripe dashboard, and free shipping is applied alongside it.
- **Inline fallback.** If that env var isn't set, the checkout function bakes
  the 10% into the line items and still applies free shipping, so the code
  works out of the box — it just won't appear as a separate "promotion" line in
  Stripe. (A warning is logged so you know to wire the coupon.)

Either way the customer pays the same. To add another code, drop an entry into
`PROMOS` (server) and the matching `PROMO_CODES` set in `app.js` (client, for
the instant "applied" feedback in the cart).

> Note: `MYSCHOOL10` is handled by the cart's own promo field, not Stripe's
> hosted promo box. Keep it as a Stripe **coupon**, not a customer-facing
> **promotion code**, so it can't also be typed in on Stripe's page (which
> wouldn't grant free shipping).

## Analytics events captured

| Event | Fired from | Notable props |
|---|---|---|
| `$pageview` | client (hash router) | `route`, `$current_url` |
| `product_viewed` | client | `slug`, `name`, `price`, `sku` |
| `product_added_to_cart` | client | `slug`, `qty`, `cart_value`, `cart_count` |
| `product_removed_from_cart` | client | `slug`, `cart_value` |
| `cart_opened` | client | `cart_count`, `cart_value` |
| `checkout_started` | client | `cart_value`, `item_count` |
| `purchase` | client (on return) | `order_id` |
| `order_completed` | **server** (webhook) | `total`, `item_count`, deduped on session id |

The server-side `order_completed` is the trustworthy revenue event (a user can
close the tab before the client `purchase` fires; the webhook can't be skipped).

## Deploy

```bash
git add . && git commit -m "stripe + posthog"
npx vercel --prod
```

Framework preset **Other** (configured via `vercel.json`). Vercel auto-installs
`stripe` and runs everything in `/api` as serverless functions — no extra config.

## Brand tokens

```css
--hepple-blue:  #003087;  /* PMS 287C  */
--hepple-ink:   #1b1a2e;  /* PMS 5255C */
--ground:       #EDE8E0;  /* PMS 11-4201 TCX */
```

## Accessibility

- Respects `prefers-reduced-motion` (incl. the new confirmation modal)
- Semantic HTML, keyboard-navigable carousels, stepper and cart
- Confirmation modal is a labelled `role="dialog"`
