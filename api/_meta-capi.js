// =============================================================
//  Meta Conversions API (server-side Purchase)
//
//  Sends a paid order to Meta from the server, so a sale still reaches
//  Meta when the visitor's browser blocked the pixel script (ad blockers).
//
//  CONSENT: only ever sends for visitors who accepted the cookie banner.
//  checkout.js records that choice on the Stripe session (capi_consent).
//  No consent, no event.
//
//  DEDUPE: event_id is the Stripe session id, the same value the browser
//  pixel uses as its eventID, so Meta counts one sale once.
//
//  Env vars:
//    META_CAPI_TOKEN        Conversions API access token (Events Manager ->
//                           dataset -> Settings). Without it this is a no-op.
//    META_PIXEL_ID          optional, defaults to the Hepple dataset
//    META_CAPI_TEST_CODE    optional, e.g. TEST12345: events then appear only
//                           in Events Manager -> Test events
//    META_GRAPH_VERSION     optional, defaults to v24.0
//  Designed by Barker Digital
// =============================================================

const crypto = require('crypto');

const DEFAULT_PIXEL_ID = '473367947643659';

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
// Meta wants trimmed, lower-cased values, hashed with SHA-256.
function hashText(v) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim().toLowerCase();
  return s ? sha256(s) : undefined;
}
function hashLetters(v) { // city / state: letters only
  if (!v) return undefined;
  const s = String(v).toLowerCase().replace(/[^a-z]/g, '');
  return s ? sha256(s) : undefined;
}
function hashPostcode(v) {
  if (!v) return undefined;
  const s = String(v).toLowerCase().replace(/\s+/g, '');
  return s ? sha256(s) : undefined;
}
function hashPhone(v) {
  if (!v) return undefined;
  let d = String(v).replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '44' + d.slice(1); // UK national format
  return d.length >= 7 ? sha256(d) : undefined;
}
function clean(obj) {
  Object.keys(obj).forEach((k) => (obj[k] === undefined || obj[k] === '') && delete obj[k]);
  return obj;
}

async function sendMetaPurchase(session, order) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return { skipped: 'no token' };

  const md = (session && session.metadata) || {};
  if (md.capi_consent !== 'true') return { skipped: 'no consent' };

  const pixelId = process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID;
  const version = process.env.META_GRAPH_VERSION || 'v24.0';

  const cd = session.customer_details || {};
  const addr = cd.address || {};
  const names = String(cd.name || '').trim().split(/\s+/);
  const first = names.length ? names[0] : '';
  const last = names.length > 1 ? names[names.length - 1] : '';

  const userData = clean({
    em: hashText(cd.email || session.customer_email),
    ph: hashPhone(cd.phone),
    fn: hashText(first),
    ln: hashText(last),
    ct: hashLetters(addr.city),
    st: hashLetters(addr.state),
    zp: hashPostcode(addr.postal_code),
    country: hashText(addr.country),
    external_id: hashText(md.ph_id),
    client_ip_address: md.capi_ip || undefined,
    client_user_agent: md.capi_ua || undefined,
    fbp: md.capi_fbp || undefined,
    fbc: md.capi_fbc || undefined,
  });

  const payload = {
    data: [{
      event_name: 'Purchase',
      event_time: session.created || Math.floor(Date.now() / 1000),
      event_id: session.id,
      action_source: 'website',
      event_source_url: md.capi_url || undefined,
      user_data: userData,
      custom_data: clean({
        currency: String(session.currency || 'gbp').toUpperCase(),
        value: (session.amount_total || 0) / 100,
        order_id: session.id,
        content_type: 'product',
        num_items: order && order.item_count ? order.item_count : undefined,
      }),
    }],
    access_token: token,
  };
  if (process.env.META_CAPI_TEST_CODE) payload.test_event_code = process.env.META_CAPI_TEST_CODE;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const resp = await fetch(`https://graph.facebook.com/${version}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`Meta CAPI ${resp.status} ${txt.slice(0, 200)}`);
    }
    return { ok: true };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { sendMetaPurchase };
