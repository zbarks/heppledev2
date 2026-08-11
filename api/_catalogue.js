// =============================================================
//  HEPPLE — server-side product catalogue (source of truth)
//  Designed by Barker Digital
//
//  Prices live HERE, not in the browser. The client only ever
//  sends { slug, qty } pairs; the server looks up the real price
//  so a tampered cart can never change what a customer is charged.
//
//  Two ways to map a product to Stripe:
//   1. (Recommended) Pre-create a Price in Stripe and set its id as
//      an env var  STRIPE_PRICE_<SLUG_UPPER_SNAKE>  e.g.
//        STRIPE_PRICE_HEPPLE_WILD_JUNIPER_GIN=price_123...
//      The checkout function will use that Price id directly.
//   2. (Fallback) If no Price id env var is set, the function builds
//      an inline price_data line item from the `price` field below.
//      Handy for first deploy — but creating real Prices in Stripe
//      is cleaner for reporting.
// =============================================================

const CURRENCY = 'gbp';

const PRODUCTS = [
  {
    slug:  'hepple-wild-juniper-gin',
    name:  'Hepple Wild Juniper Gin',
    price: 39.95,                // GBP, inc. VAT
    sku:   'HEP-GIN-70',
    image: 'assets/products/hepple-gin.jpg',
    meta:  { size: '70cl', abv: '45%' },
  },
  {
    slug:  'hepple-douglas-fir-vodka',
    name:  'Hepple Douglas Fir Vodka',
    price: 39.95,
    sku:   'HEP-DFV-70',
    image: 'assets/products/douglas-fir.jpg',
    meta:  { size: '70cl', abv: '41%' },
  },
  {
    slug:  'hepple-moorland-vodka',
    name:  'Hepple Moorland Vodka',
    price: 34.95,
    sku:   'HEP-WHV-70',
    image: 'assets/products/wheat-vodka.jpg',
    meta:  { size: '70cl', abv: '41%' },
  },

  // ---- Additional / limited expressions ----
  {
    slug:  'hepple-sloe-hawthorn',
    name:  'Hepple Sloe & Hawthorn',
    price: 32.50,
    sku:   'HEP-SLO-50',
    image: 'assets/products/sloe-hawthorn-main.jpg',
    meta:  { size: '50cl', abv: '29.9%' },
  },
  {
    slug:  'hepple-aquavit',
    name:  'Hepple Aquavit',
    price: 39.95,
    sku:   'HEP-AQV-70',
    image: 'assets/products/aquavit-main.jpg',
    meta:  { size: '70cl', abv: '40%' },
  },
  {
    slug:  'hepple-negroni',
    name:  'Hepple Negroni',
    price: 32.50,
    sku:   'HEP-NEG-70',
    image: 'assets/products/negroni-main.jpg',
    meta:  { size: '70cl', abv: '24%' },
  },

  // ---- Add-on: handwritten card (£5) ----
  // `addon: true` lets checkout.js (a) reject a card-only basket and
  // (b) exclude the card from the free-shipping threshold. No image, so it
  // renders as a plain line on the Stripe page.
  {
    slug:  'handwritten-card',
    name:  'Gift Wrap & Handwritten Card',
    price: 5.00,
    sku:   'HEP-CARD',
    image: '',
    addon: true,
    meta:  {},
  },
];

const BY_SLUG = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));

// Shipping: free over the threshold, flat fee below it.
const SHIPPING = {
  freeThreshold: 45.0, // GBP — matches the shop hero copy
  flatFee: 4.95,       // GBP
  label: 'UK standard delivery',
};

// Env var name for a product's Stripe Price id.
function priceEnvKey(slug) {
  return 'STRIPE_PRICE_' + slug.toUpperCase().replace(/-/g, '_');
}

// =============================================================
//  PROMOTIONS
//  Codes live in Supabase (public.discount_codes) and are managed from the
//  portal — Discounts page. Nothing is hardcoded here any more.
//
//  A code applies EITHER a % discount or a fixed £ amount, and can also
//  force free shipping. One redemption per visitor is the default.
//
//  The money is realised in one of two ways, exactly as before:
//   • Stripe coupon — when the code row carries a `stripe_coupon_id`, or a
//     STRIPE_COUPON_<CODE> env var exists. Cleaner reporting: the discount
//     shows as a proper promotion in the Stripe dashboard.
//   • Inline — otherwise the discount is baked into the line items, so a
//     code created in the portal works immediately with no Stripe setup.
//  Either way the customer pays the same.
//
//  FAILS CLOSED: if Supabase is unreachable, lookupPromo returns null and no
//  discount is applied. That is deliberate — the alternative (guessing) would
//  mean charging the wrong amount. The cart surfaces a retry message.
// =============================================================

// Ask Postgres to validate the code, and optionally tell us whether this
// visitor has already redeemed it. One round trip, all the logic in one place.
//
//   lookupPromo('SUMMER20')                        -> terms, or null
//   lookupPromo('SUMMER20', { phId, subtotal })    -> terms + alreadyUsed + amount
//
// NOTE: async. Callers must await.
async function lookupPromo(code, opts) {
  if (!code || typeof code !== 'string') return null;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // not configured -> no discount

  const o = opts || {};

  try {
    const resp = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/validate_discount_code`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_code: code.trim().slice(0, 40),
        p_subtotal: typeof o.subtotal === 'number' ? o.subtotal : null,
        p_ph_id: o.phId || null,
      }),
    });
    if (!resp.ok) return null;

    const rows = await resp.json().catch(() => null);
    const r = Array.isArray(rows) ? rows[0] : rows;
    if (!r) return null;

    // An unrecognised or inactive code is simply "no promo".
    // An already-used one still comes back so checkout can return PROMO_USED.
    if (!r.valid && !r.already_used) return null;

    return {
      code:           r.code,
      label:          r.label,
      percentOff:     r.kind === 'percent' ? Number(r.value) : 0,
      amountOff:      r.kind === 'fixed'   ? Number(r.value) : 0,
      freeShipping:   !!r.free_shipping,
      alreadyUsed:    !!r.already_used,
      reason:         r.reason || null,
      stripeCouponId: r.stripe_coupon_id || null,
      // Legacy escape hatch: STRIPE_COUPON_MYSCHOOL10 etc. still honoured.
      couponEnv:      'STRIPE_COUPON_' + String(r.code).replace(/[^A-Z0-9]/gi, '_').toUpperCase(),
      discountAmount: r.discount_amount == null ? null : Number(r.discount_amount),
      newSubtotal:    r.new_subtotal    == null ? null : Number(r.new_subtotal),
    };
  } catch (_) {
    return null; // network/other -> fail closed
  }
}

module.exports = {
  CURRENCY, PRODUCTS, BY_SLUG, SHIPPING, priceEnvKey, lookupPromo,
};
