// =============================================================
//  Checkout leads: the email captured in the cart before Stripe.
//  Server only. Fails soft: if Supabase is down or unconfigured,
//  checkout still goes ahead.
//  Designed by Barker Digital
// =============================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function cleanEmail(v) {
  if (typeof v !== 'string') return '';
  const e = v.trim().toLowerCase();
  return e.length <= 254 && EMAIL_RE.test(e) ? e : '';
}

function base() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

async function withTimeout(fn, ms) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try { return await fn(ctl.signal); } finally { clearTimeout(t); }
}

// Save (or refresh) the lead for a Stripe session.
async function saveLead(lead) {
  const b = base();
  if (!b) return { skipped: 'supabase-not-configured' };
  try {
    const resp = await withTimeout((signal) => fetch(
      `${b.url}/rest/v1/checkout_leads?on_conflict=stripe_session_id`,
      {
        method: 'POST',
        signal,
        headers: {
          apikey: b.key,
          Authorization: `Bearer ${b.key}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify([lead]),
      }
    ), 2500);
    if (!resp.ok) {
      console.error('[leads] save failed', resp.status, await resp.text().catch(() => ''));
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('[leads] save error:', err && err.message);
    return { ok: false };
  }
}

// Mark a lead as paid once the Stripe webhook sees the order complete.
async function markLeadPaid(sessionId) {
  const b = base();
  if (!b || !sessionId) return { skipped: true };
  const resp = await fetch(
    `${b.url}/rest/v1/checkout_leads?stripe_session_id=eq.${encodeURIComponent(sessionId)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: b.key,
        Authorization: `Bearer ${b.key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ status: 'paid', paid_at: new Date().toISOString() }),
    }
  );
  if (!resp.ok) throw new Error(`Supabase lead update failed ${resp.status}`);
  return { ok: true };
}

module.exports = { cleanEmail, saveLead, markLeadPaid };
