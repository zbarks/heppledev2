// =============================================================
//  Shared promo-redemption lookup.
//
//  hasRedeemed(code, phId) → true if this PostHog visitor has already
//  redeemed `code` on a paid order (recorded by the Stripe webhook in
//  the promo_redemptions table).
//
//  Design notes:
//   • The live block is keyed on the PostHog distinct id (a first-party
//     browser id). It deters casual reuse but is not bulletproof —
//     clearing cookies or switching device/browser yields a new id.
//     Email is stored alongside for reporting / cross-device abuse
//     spotting, but isn't usable as a live gate (Stripe only collects
//     the email AFTER the session is created).
//   • FAILS OPEN: if Supabase isn't configured or the query errors, this
//     returns false (i.e. "not redeemed"), so a database blip can never
//     block a legitimate customer from using the code. Worst case is a
//     few extra discounts, which is far less harmful than locking
//     everyone out.
//  Designed by Barker Digital
// =============================================================

async function hasRedeemed(code, phId) {
  if (!code || !phId) return false;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false; // not configured → fail open

  try {
    const base = url.replace(/\/$/, '');
    const q = `${base}/rest/v1/promo_redemptions`
      + `?select=id&limit=1`
      + `&code=eq.${encodeURIComponent(code)}`
      + `&posthog_distinct_id=eq.${encodeURIComponent(phId)}`;
    const resp = await fetch(q, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!resp.ok) return false; // error → fail open
    const rows = await resp.json().catch(() => []);
    return Array.isArray(rows) && rows.length > 0;
  } catch (_) {
    return false; // network/other → fail open
  }
}

module.exports = { hasRedeemed };
