// =============================================================
//  POST /api/promo-check
//  Quick "can this visitor still use this code?" check for the cart.
//
//  Request body:  { code: "MYSCHOOL10", ph_id: "<posthog distinct id>" }
//  Response:      { valid: bool, used: bool }
//    valid → the code is a recognised promo at all
//    used  → this PostHog visitor has already redeemed it on a paid order
//
//  This is UX only — the authoritative gate is api/checkout.js, which
//  re-checks before applying any discount. Fails open (used:false) if
//  Supabase isn't configured.
//  Designed by Barker Digital
// =============================================================

const { lookupPromo } = require('./_catalogue');
const { hasRedeemed } = require('./_promo');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }

  const promo = lookupPromo(body && body.code);
  if (!promo) return res.status(200).json({ valid: false, used: false });

  const phId = typeof (body && body.ph_id) === 'string' ? body.ph_id.slice(0, 120) : null;
  const used = await hasRedeemed(promo.code, phId);

  return res.status(200).json({ valid: true, used });
};
