// =============================================================
//  POST /api/stripe-webhook
//  Stripe calls this when a checkout completes. We:
//    1. verify the signature (raw body required)
//    2. write the order into Supabase  (table: orders)
//    3. fire a server-side PostHog "order_completed" event
//
//  Point Stripe at:  https://<your-domain>/api/stripe-webhook
//  Listen for event: checkout.session.completed   (and async variants)
//
//  Env vars:
//    STRIPE_SECRET_KEY
//    STRIPE_WEBHOOK_SECRET       whsec_...   (from the Stripe webhook dashboard)
//    SUPABASE_URL                (optional)  https://xxxx.supabase.co
//    SUPABASE_SERVICE_ROLE_KEY   (optional)  service role — server only, NEVER client
//    POSTHOG_API_KEY             (optional)  phc_...  (project API key)
//    POSTHOG_HOST                (optional)  https://eu.i.posthog.com  (default)
//  Designed by Barker Digital
// =============================================================

// Vercel must NOT pre-parse the body or the signature check fails.
module.exports.config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function recordToSupabase(order) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { skipped: 'supabase-not-configured' };
  // Upsert on stripe_session_id so Stripe retries don't duplicate the row.
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/orders?on_conflict=stripe_session_id`;
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify([order]),
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '');
    throw new Error(`Supabase insert failed ${resp.status}: ${txt}`);
  }
  return { ok: true };
}

// Record a promo redemption so the same visitor can't reuse a one-shot code.
// Keyed on the PostHog distinct id (the live block) with email stored for
// reporting. Unique (stripe_session_id, code) means Stripe retries are no-ops.
async function recordPromoRedemption(order) {
  if (!order.promo_code) return { skipped: 'no-promo' };
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { skipped: 'supabase-not-configured' };
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/promo_redemptions?on_conflict=stripe_session_id,code`;
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify([{
      code: order.promo_code,
      posthog_distinct_id: order.posthog_distinct_id || null,
      customer_email: order.customer_email ? order.customer_email.toLowerCase() : null,
      stripe_session_id: order.stripe_session_id,
    }]),
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '');
    throw new Error(`Supabase promo insert failed ${resp.status}: ${txt}`);
  }
  return { ok: true };
}

async function capturePostHog(order) {
  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) return { skipped: 'posthog-not-configured' };
  const host = (process.env.POSTHOG_HOST || 'https://eu.i.posthog.com').replace(/\/$/, '');
  const resp = await fetch(`${host}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      event: 'order_completed',
      // tie back to the browser visitor if we passed the id through, else the email
      distinct_id: order.posthog_distinct_id || order.customer_email || order.stripe_session_id,
      properties: {
        $insert_id: order.stripe_session_id, // dedupe on Stripe retries
        revenue: order.total,
        currency: order.currency,
        item_count: order.item_count,
        items: order.items,
        order_id: order.stripe_session_id,
        customer_email: order.customer_email,
        source: 'stripe-webhook',
      },
    }),
  });
  if (!resp.ok) throw new Error(`PostHog capture failed ${resp.status}`);
  return { ok: true };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return res.status(500).json({ error: 'Webhook not configured (missing Stripe secrets).' });
  }

  const stripe = require('stripe')(key);
  const raw = await readRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error('[webhook] signature verification failed:', err && err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed' ||
        event.type === 'checkout.session.async_payment_succeeded') {
      const s = event.data.object;

      // Pull line items for a clean order record
      let lineItems = [];
      try {
        const li = await stripe.checkout.sessions.listLineItems(s.id, { limit: 100 });
        lineItems = li.data.map((l) => ({
          description: l.description,
          quantity: l.quantity,
          amount_total: (l.amount_total || 0) / 100,
        }));
      } catch (_) { /* non-fatal */ }

      const order = {
        stripe_session_id: s.id,
        stripe_payment_intent: s.payment_intent || null,
        customer_email: (s.customer_details && s.customer_details.email) || s.customer_email || null,
        customer_name: (s.customer_details && s.customer_details.name) || null,
        currency: (s.currency || 'gbp').toLowerCase(),
        total: (s.amount_total || 0) / 100,
        subtotal: (s.amount_subtotal || 0) / 100,
        shipping: ((s.total_details && s.total_details.amount_shipping) || 0) / 100,
        item_count: parseInt((s.metadata && s.metadata.item_count) || '0', 10),
        items: lineItems,
        cart_summary: (s.metadata && s.metadata.cart) || null,
        posthog_distinct_id: (s.metadata && s.metadata.ph_id) || null,
        promo_code: (s.metadata && s.metadata.promo_code) || null,
        has_gift_card: (s.metadata && s.metadata.has_gift_card) === 'true',
        gift_message: (s.metadata && s.metadata.gift_message) || null,
        shipping_address: (function () {
  var sd = (s.collected_information && s.collected_information.shipping_details)
    || (s.shipping_details && s.shipping_details.address ? { address: s.shipping_details.address, name: s.shipping_details.name } : null)
    || (s.shipping && s.shipping.address ? { address: s.shipping.address, name: s.shipping.name } : null);
  var address = (sd && sd.address) || (s.customer_details && s.customer_details.address) || null;
  if (!address) return null;
  var name = (sd && sd.name) || (s.customer_details && s.customer_details.name) || null;
  return name ? Object.assign({}, address, { name: name }) : address;
})(),
        payment_status: s.payment_status || 'paid',
        fulfilled: false,
        fulfilled_at: null,
        created_at: new Date((s.created || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
      };

      const results = await Promise.allSettled([
        recordToSupabase(order),
        recordPromoRedemption(order),
        capturePostHog(order),
      ]);
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[webhook] sink ${i} failed:`, r.reason && r.reason.message);
        }
      });
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[webhook] handler error:', err && err.message);
    // 200 so Stripe doesn't hammer retries for a downstream blip we've logged
    return res.status(200).json({ received: true, warning: 'handler error logged' });
  }
};
