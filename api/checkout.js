// =============================================================
//  POST /api/checkout
//  Builds a Stripe Checkout Session from the cart and returns its URL.
//
//  Request body:  { items: [{ slug, qty }, ...] }
//  Response:      { url: "https://checkout.stripe.com/..." }
//
//  Env vars required (set in Vercel → Project → Settings → Environment):
//    STRIPE_SECRET_KEY            sk_live_... or sk_test_...
//    (optional) STRIPE_PRICE_<SLUG>   pre-made Stripe Price ids
//    (optional) SITE_URL          canonical site origin for redirects
//                                 (falls back to the request origin)
//  Designed by Barker Digital
// =============================================================

const { BY_SLUG, CURRENCY, SHIPPING, priceEnvKey, lookupPromo } = require('./_catalogue');

function siteOrigin(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'Stripe is not configured yet.',
      hint: 'Add STRIPE_SECRET_KEY in your Vercel project environment variables.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  const items = Array.isArray(body && body.items) ? body.items : [];
  if (!items.length) return res.status(400).json({ error: 'Cart is empty.' });

  // Optional PostHog visitor id so the webhook can tie the purchase
  // back to the browsing session. Sanitised + length-capped.
  const phId = typeof (body && body.ph_id) === 'string'
    ? body.ph_id.slice(0, 120)
    : null;

  // Optional handwritten-card message. Capped at 250 chars (the client caps it
  // too); only used if a card line is actually present and valid.
  const giftMessage = typeof (body && body.gift_message) === 'string'
    ? body.gift_message.slice(0, 250)
    : '';

  // ---- Promo code (validated server-side; the browser can't be trusted) ----
  // A recognised code can apply a % discount and/or free shipping. The % is
  // applied via a Stripe coupon when one is configured (STRIPE_COUPON_<CODE>),
  // otherwise it's baked into the line items so the code still works.
  const promo = lookupPromo(body && body.promo_code);
  const couponId = promo && promo.couponEnv ? process.env[promo.couponEnv] : null;
  // Inline % discount only when a recognised promo has no Stripe coupon wired.
  const inlineDiscount = promo && !couponId ? (promo.percentOff || 0) : 0;
  if (promo && !couponId) {
    console.warn(
      `[checkout] Promo "${promo.code}" applied via inline discount — ` +
      `set ${promo.couponEnv} in Vercel to use the Stripe coupon instead.`
    );
  }

  // ---- Validate cart against the server catalogue ----
  const clean = [];
  let subtotal = 0;
  let goodsSubtotal = 0; // excludes add-ons (the card), for the shipping test
  for (const it of items) {
    const product = BY_SLUG[it && it.slug];
    if (!product) continue;
    const qty = Math.max(1, Math.min(99, parseInt(it.qty, 10) || 1));
    clean.push({ product, qty });
    subtotal += product.price * qty;
    if (!product.addon) goodsSubtotal += product.price * qty;
  }
  if (!clean.length) return res.status(400).json({ error: 'No valid items in cart.' });

  // ---- GUARD: a handwritten card can never be the only thing in the basket.
  // This is the authoritative check (the browser can be bypassed). ----
  const hasCard = clean.some(({ product }) => product.addon);
  const hasGoods = clean.some(({ product }) => !product.addon);
  if (hasCard && !hasGoods) {
    return res.status(400).json({
      error: 'A handwritten card can only be added to an order with at least one product.',
    });
  }

  const origin = siteOrigin(req);
  const stripe = require('stripe')(key);

  // ---- Build line items (Price id if provided, else inline price_data) ----
  // When an inline promo discount is in force we must build price_data (a fixed
  // Stripe Price id can't be reduced), so the Price-id shortcut is skipped in
  // that case to make sure the discount actually reaches every line.
  const discountMult = inlineDiscount ? (1 - inlineDiscount / 100) : 1;
  const line_items = clean.map(({ product, qty }) => {
    const priceId = process.env[priceEnvKey(product.slug)];
    if (priceId && !inlineDiscount) return { price: priceId, quantity: qty };
    const product_data = {
      name: product.name,
      metadata: { slug: product.slug, sku: product.sku },
    };
    // Only attach an image when the product has one (the card has none).
    if (product.image) product_data.images = [`${origin}/${product.image}`];
    return {
      quantity: qty,
      price_data: {
        currency: CURRENCY,
        unit_amount: Math.round(product.price * 100 * discountMult),
        product_data,
      },
    };
  });

  // ---- Shipping: free over threshold, OR free when the promo grants it ----
  // The card add-on does not count toward the free-shipping threshold.
  const freeShipping = (promo && promo.freeShipping) || goodsSubtotal >= SHIPPING.freeThreshold;
  const shipping_options = [{
    shipping_rate_data: {
      type: 'fixed_amount',
      display_name: freeShipping ? `${SHIPPING.label} (free)` : SHIPPING.label,
      fixed_amount: {
        amount: freeShipping ? 0 : Math.round(SHIPPING.flatFee * 100),
        currency: CURRENCY,
      },
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 2 },
        maximum: { unit: 'business_day', value: 5 },
      },
    },
  }];

  // Compact cart summary stored on the session (≤ 500 chars per metadata value)
  const cartSummary = clean
    .map(({ product, qty }) => `${qty}x ${product.sku}`)
    .join(', ')
    .slice(0, 480);

  try {
    const params = {
      mode: 'payment',
      line_items,
      shipping_options,
      shipping_address_collection: { allowed_countries: ['GB'] },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      customer_creation: 'always',
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancel#/shop`,
      metadata: {
        source: 'hepple-site',
        cart: cartSummary,
        item_count: String(clean.reduce((s, i) => s + i.qty, 0)),
        ph_id: phId || '',
        has_gift_card: hasCard ? 'true' : 'false',
        gift_message: hasCard ? giftMessage : '',
        promo_code: promo ? promo.code : '',
      },
    };

    // Discount handling (Stripe rejects `discounts` + `allow_promotion_codes`
    // together, so it's strictly one or the other):
    //   • Stripe coupon configured  → apply it server-side.
    //   • inline promo discount     → already baked into line_items; no box,
    //                                  so a second code can't be stacked.
    //   • no promo                  → leave the promo box on for any other
    //                                  Stripe codes, exactly as before.
    if (couponId) {
      params.discounts = [{ coupon: couponId }];
    } else if (!inlineDiscount) {
      params.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(params);
    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('[checkout] Stripe error:', err && err.message);
    return res.status(502).json({ error: 'Could not start checkout. Please try again.' });
  }
};
