// =============================================================
//  GET /api/order-summary?session_id=cs_...
//  Returns just the paid total for a Stripe Checkout Session so the
//  browser can send an accurate Meta Pixel Purchase event.
//  Only answers for sessions that are actually paid, and only returns
//  the amount and currency (nothing about the customer).
//
//  Env vars required: STRIPE_SECRET_KEY
//  Designed by Barker Digital
// =============================================================

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.STRIPE_SECRET_KEY;
  const id = req.query && req.query.session_id;
  if (!key || typeof id !== 'string' || !/^cs_[A-Za-z0-9_]{10,200}$/.test(id)) {
    return res.status(400).json({ error: 'Bad request' });
  }

  try {
    const stripe = require('stripe')(key);
    const s = await stripe.checkout.sessions.retrieve(id);
    if (!s || s.payment_status !== 'paid') return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({
      value: (s.amount_total || 0) / 100,
      currency: String(s.currency || 'gbp').toUpperCase(),
    });
  } catch (_) {
    return res.status(404).json({ error: 'Not found' });
  }
};
