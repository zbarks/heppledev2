// =============================================================
//  api/_email.js  —  transactional email via Resend (server only)
//
//  Used by the Stripe webhook to send an order confirmation.
//
//  Env vars:
//    EMAILS_ENABLED   "true" to actually send. Anything else = no-op
//                     (lets you deploy + backfill without emailing anyone).
//    RESEND_API_KEY   re_...   from resend.com
//    EMAIL_FROM       e.g.  Hepple Spirits <orders@hepple.barkerdigital.co.uk>
//    EMAIL_REPLY_TO   e.g.  hello@hepplespirits.com   (where replies land)
//  Designed by Barker Digital
// =============================================================

const BRAND = {
  name:   'Hepple Spirits',
  cream:  '#f6f2ea',
  navy:   '#003087',
  ink:    '#1c1c1c',
  muted:  '#6b6b6b',
};

function emailsEnabled() {
  return process.env.EMAILS_ENABLED === 'true' && !!process.env.RESEND_API_KEY;
}

const money = (n, ccy) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: (ccy || 'GBP').toUpperCase() })
    .format(Number(n) || 0);

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Low-level send. Resolves to {ok:true} or {skipped|error}. Never throws.
async function sendEmail({ to, subject, html }) {
  if (!emailsEnabled()) return { skipped: 'emails-disabled' };
  if (!to) return { skipped: 'no-recipient' };
  try {
    const payload = {
      from: process.env.EMAIL_FROM || 'Hepple Spirits <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    };
    if (process.env.EMAIL_REPLY_TO) payload.reply_to = process.env.EMAIL_REPLY_TO;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      return { error: `resend ${r.status}: ${txt.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { error: String((err && err.message) || err) };
  }
}

// Shared HTML shell so confirmation + shipped emails look identical.
function shell(innerHtml, preheader) {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(BRAND.name)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.cream};">
<span style="display:none;opacity:0;color:${BRAND.cream};font-size:1px;">${esc(preheader || '')}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;
             font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
      <tr><td style="background:${BRAND.navy};padding:26px 32px;">
        <div style="color:#ffffff;font-size:20px;letter-spacing:.14em;font-weight:600;">
          ${esc(BRAND.name.toUpperCase())}
        </div>
      </td></tr>
      ${innerHtml}
      <tr><td style="padding:22px 32px;background:${BRAND.cream};color:${BRAND.muted};font-size:12px;line-height:1.6;">
        ${esc(BRAND.name)} · Hepple, Northumberland<br>
        This email was sent to confirm a recent order. Please drink responsibly.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function rowsForItems(items, ccy) {
  if (!Array.isArray(items) || !items.length) return '';
  return items.map((it) => {
    const name = it.description || it.name || it.sku || 'Item';
    const qty = it.quantity || it.qty || 1;
    const line = it.amount_total != null ? money(it.amount_total, ccy)
               : (it.price != null ? money(it.price * qty, ccy) : '');
    return `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${esc(qty)}× ${esc(name)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;text-align:right;white-space:nowrap;">${esc(line)}</td>
    </tr>`;
  }).join('');
}

function addressBlock(addr) {
  if (!addr) return '';
  const lines = [addr.name, addr.line1, addr.line2, addr.city, addr.postal_code, addr.country]
    .filter(Boolean).map(esc).join('<br>');
  if (!lines) return '';
  return `<div style="margin-top:6px;font-size:14px;line-height:1.6;color:${BRAND.ink};">${lines}</div>`;
}

// ---- Order confirmation -------------------------------------
async function sendOrderConfirmation(order) {
  const ccy = order.currency || 'gbp';
  const first = (order.customer_name || '').split(' ')[0];
  const giftBlock = order.gift_message
    ? `<tr><td style="padding:0 32px 8px;">
         <div style="font-size:12px;letter-spacing:.1em;color:${BRAND.muted};text-transform:uppercase;">Gift message</div>
         <div style="margin-top:6px;font-size:14px;font-style:italic;color:${BRAND.ink};">&ldquo;${esc(order.gift_message)}&rdquo;</div>
       </td></tr>` : '';

  const inner = `
    <tr><td style="padding:30px 32px 8px;">
      <div style="font-size:18px;font-weight:600;">Thank you${first ? ', ' + esc(first) : ''} — your order is confirmed</div>
      <div style="margin-top:6px;font-size:14px;color:${BRAND.muted};">
        We're preparing it now and will email tracking as soon as it ships.
      </div>
    </td></tr>
    <tr><td style="padding:14px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${rowsForItems(order.items, ccy)}
        <tr>
          <td style="padding:10px 0 0;font-size:14px;color:${BRAND.muted};">Shipping</td>
          <td style="padding:10px 0 0;font-size:14px;text-align:right;">${order.shipping ? money(order.shipping, ccy) : 'Free'}</td>
        </tr>
        <tr>
          <td style="padding:6px 0 0;font-size:16px;font-weight:700;">Total</td>
          <td style="padding:6px 0 0;font-size:16px;font-weight:700;text-align:right;">${money(order.total, ccy)}</td>
        </tr>
      </table>
    </td></tr>
    ${giftBlock}
    <tr><td style="padding:18px 32px 26px;">
      <div style="font-size:12px;letter-spacing:.1em;color:${BRAND.muted};text-transform:uppercase;">Delivery to</div>
      ${addressBlock(order.shipping_address) || '<div style="margin-top:6px;font-size:14px;color:#b00;">No address on file — we may be in touch.</div>'}
    </td></tr>`;

  return sendEmail({
    to: order.customer_email,
    subject: `Your ${BRAND.name} order is confirmed`,
    html: shell(inner, `Thanks${first ? ' ' + first : ''} — your ${BRAND.name} order is confirmed.`),
  });
}

module.exports = { emailsEnabled, sendEmail, sendOrderConfirmation, esc, money, shell, addressBlock };
