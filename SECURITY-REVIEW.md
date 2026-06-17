# Hepple site — security review

Date: 17 Jun 2026. Scope: `api/*`, `vercel.json`, `supabase-schema.sql`, `index.html`, `app.js`.

## What's already solid
- **Server-authoritative pricing.** `api/checkout.js` ignores any client price and
  looks each item up in `api/_catalogue.js`, caps quantity to 1–99, caps the gift
  message and PostHog id, and rejects a card-only basket server-side. A tampered
  cart can't change what a customer is charged.
- **Webhook is verified.** `api/stripe-webhook.js` disables the body parser, reads the
  raw body, and verifies the Stripe signature with `constructEvent` before trusting
  anything. Upserts on `stripe_session_id` so retries don't duplicate orders.
- **Order data is locked down.** RLS is enabled on `public.orders` with no anon
  policies, so the public/anon key can read nothing. Only the service-role key
  (server-side, in the webhook) can write. No Supabase keys appear in client code.
- **No secrets in the browser.** Only the PostHog `phc_` project key is in `index.html`,
  which is a public ingest key by design. No `sk_`, `whsec_`, or service-role keys client-side.
- **XSS.** The only user-entered value rendered to the DOM is the gift message, and it
  is HTML-escaped (`escapeHtml`) in both the cart line and the textarea. Everything else
  rendered via `innerHTML` is static catalogue/team/cocktail data. The URL hash/slug is
  looked up, never reflected into the DOM.

## Fixed in this bundle
- **DB schema mismatch (data loss risk).** The webhook writes `has_gift_card` and
  `gift_message`, but `supabase-schema.sql` didn't define those columns — PostgREST
  rejects an insert that references unknown columns, so the *entire* order row fails
  to save (the webhook then returns 200 and only logs it). Added both columns to the
  schema plus `alter table ... add column if not exists ...` for the live table.
  **Action: run those two ALTER lines in Supabase if your live table predates this.**

## Recommended (not blocking)
1. **Set `SITE_URL`** in Vercel env. When it's unset, `checkout.js` builds the Stripe
   `success_url`/`cancel_url` and product image URLs from the request `Host` header,
   which a client can spoof — a crafted Host could send a buyer to an attacker domain
   after payment. Setting `SITE_URL` to your canonical origin closes this.
2. **Rate-limit `/api/checkout`.** It creates a Stripe session on every call with no
   throttle; an abuser could spam session creation. A simple per-IP limiter
   (Vercel middleware or Upstash) is enough.
3. **Add `Content-Security-Policy` and `Strict-Transport-Security`** in `vercel.json`.
   You already have `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy`.
   Note: the inline PostHog/loader scripts mean a strict CSP needs nonces/hashes or a
   pragmatic `script-src 'self' 'unsafe-inline' https://*.posthog.com` to start.
4. **Keep deps current.** `stripe ^16` — run `npm audit` / bump periodically.
5. **Price parity.** The server charges from `_catalogue.js`; make sure the prices shown
   in `app.js` match it so customers never see one price and get charged another.

## Confirmed safe
- `api/_catalogue.js` is a helper module (underscore prefix), not a routable endpoint
  on Vercel — prices/SKUs there are not served as an API.
- No `.env`, `.git`, or key material is included in the bundle.


## Added: cookie consent
A bottom consent banner now gates analytics. PostHog initialises with
`opt_out_capturing_by_default: true` and session recording off, so no analytics
events or tracking cookies are sent until the visitor taps **Accept**. Choosing
**Essential only** opts them out. The choice is remembered in `localStorage`
(`hepple:cookie-consent`). This keeps the site aligned with UK PECR/GDPR for
non-essential cookies. (A short privacy/cookies page is still worth adding so the
banner can link to it.)
