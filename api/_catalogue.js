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
//  A promo code can apply a % discount and/or force free shipping.
//
//  The percentage is realised through a Stripe coupon when its id is
//  provided via the env var named in `couponEnv` (cleaner reporting —
//  the discount shows as a proper promotion in the Stripe dashboard).
//  If that env var is NOT set, the checkout function falls back to
//  discounting the line items inline, so the code still works out of
//  the box. Either way the customer pays the same.
//
//  To wire the Stripe coupon you already created:
//    Vercel → Project → Settings → Environment Variables
//    STRIPE_COUPON_MYSCHOOL10 = <the coupon id, e.g. aB12cD34>
//  (Dashboard → Product catalogue → Coupons → open it → the id is the
//   short string in the URL / details panel.)
//
//  The code STRING (e.g. MYSCHOOL10) is not secret — it's printed on
//  marketing material — so the browser is allowed to know it. The
//  coupon id (the money part) stays server-side only.
// =============================================================
const PROMOS = {
  MYSCHOOL10: {
    percentOff: 10,        // 10% off
    freeShipping: true,    // shipping forced to £0 when applied
    couponEnv: 'STRIPE_COUPON_MYSCHOOL10',
    label: '10% off + free UK delivery',
  },
};

// Normalise + look up a code. Returns the promo (with its key) or null.
function lookupPromo(code) {
  if (!code || typeof code !== 'string') return null;
  const key = code.trim().toUpperCase();
  return PROMOS[key] ? Object.assign({ code: key }, PROMOS[key]) : null;
}

module.exports = {
  CURRENCY, PRODUCTS, BY_SLUG, SHIPPING, priceEnvKey, PROMOS, lookupPromo,
};
