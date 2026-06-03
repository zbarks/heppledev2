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
    name:  'Hepple Wheat Vodka',
    price: 34.95,
    sku:   'HEP-WHV-70',
    image: 'assets/products/wheat-vodka.jpg',
    meta:  { size: '70cl', abv: '41%' },
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

module.exports = { CURRENCY, PRODUCTS, BY_SLUG, SHIPPING, priceEnvKey };
