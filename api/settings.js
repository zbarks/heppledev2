// =============================================================
//  GET /api/settings   (public, read-only)
//  Returns storefront settings the browser needs, e.g.
//    { "gift_enabled": true }
//  Reads from Supabase site_settings. Fails OPEN (gift on) so a
//  settings blip never blocks the shop.
//  Designed by Barker Digital
// =============================================================

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  let giftEnabled = true; // default: on
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    try {
      const r = await fetch(
        `${url.replace(/\/$/, '')}/rest/v1/site_settings?key=eq.gift_enabled&select=value`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (r.ok) {
        const rows = await r.json();
        if (rows.length && rows[0].value === false) giftEnabled = false;
      }
    } catch (_) { /* fail open */ }
  }

  return res.status(200).json({ gift_enabled: giftEnabled });
};
