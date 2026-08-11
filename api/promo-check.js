// =============================================================
//  POST /api/promo-check
//  "Is this code real, what does it do, and can this visitor use it?"
//
//  Request body:  { code: "MYSCHOOL10", ph_id: "<posthog distinct id>" }
//  Response:      { valid, used, reason, code, label,
//                   percentOff, amountOff, freeShipping }
//
//  Codes now live in Supabase (managed from the portal), so the browser has
//  no local list to read the terms from — this endpoint supplies them, and
//  the cart caches the result to render the applied state.
//
//  This is still UX only: api/checkout.js re-validates from the database
//  before a penny is discounted.
//
//  FAILS CLOSED. The old version could fall back to a hardcoded map when
//  Supabase was unreachable; there is no map any more, so a failed lookup
//  means "can't confirm" and the cart asks the shopper to retry. Applying an
//  unverified code would risk charging the wrong amount.
//  Designed by Barker Digital
// =============================================================

const { lookupPromo } = require('./_catalogue');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }

  const phId = typeof (body && body.ph_id) === 'string' ? body.ph_id.slice(0, 120) : null;

  const promo = await lookupPromo(body && body.code, { phId });

  if (!promo) {
    return res.status(200).json({
      valid: false,
      used: false,
      reason: 'CODE NOT RECOGNISED',
    });
  }

  if (promo.alreadyUsed) {
    return res.status(200).json({
      valid: false,
      used: true,
      reason: promo.reason || "YOU'VE ALREADY USED THIS CODE",
    });
  }

  return res.status(200).json({
    valid:        true,
    used:         false,
    reason:       null,
    code:         promo.code,
    label:        promo.label,
    percentOff:   promo.percentOff || 0,
    amountOff:    promo.amountOff  || 0,
    freeShipping: !!promo.freeShipping,
  });
};
