// Serverless function: POST /api/note   { text, email?, page? }
// Emails a visitor's sticky note to Vamsi.
//
// Set ONE of these in Vercel → Settings → Environment Variables, then redeploy:
//
//   WEB3FORMS_KEY   easiest. Get a free access key at https://web3forms.com
//                   (enter kosurivamsi5@gmail.com, they email you the key).
//                   Free tier: 250 notes/month. No DNS setup.
//
//   RESEND_API_KEY  alternative. From https://resend.com
//                   Optional NOTE_TO (defaults to kosurivamsi5@gmail.com)
//                   Optional NOTE_FROM (defaults to onboarding@resend.dev)
//
// With neither set the endpoint returns 501 and the site offers a mailto: link,
// so the button still does something sensible.

const TO = process.env.NOTE_TO || 'kosurivamsi5@gmail.com';

// small in-memory rate limit per instance (best effort)
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 10 * 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5; // 5 notes per 10 minutes per IP
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many notes, try later' });

  const body = req.body || {};
  const text = typeof body.text === 'string' ? body.text.trim().slice(0, 1200) : '';
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 120) : '';
  const page = typeof body.page === 'string' ? body.page.slice(0, 120) : '';
  if (!text) return res.status(400).json({ error: 'Empty note' });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'That email looks wrong' });
  }

  const subject = 'Sticky note from your website';
  const lines = [
    text,
    '',
    '—',
    email ? `Reply to: ${email}` : 'No reply address given',
    page ? `Left on: ${page}` : '',
  ].filter(Boolean).join('\n');

  try {
    if (process.env.WEB3FORMS_KEY) {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY,
          subject,
          from_name: 'Website note',
          replyto: email || undefined,
          message: lines,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.success === false) {
        console.error('web3forms', r.status, JSON.stringify(d).slice(0, 300));
        return res.status(502).json({ error: 'Mail service refused' });
      }
      return res.status(200).json({ ok: true });
    }

    if (process.env.RESEND_API_KEY) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.NOTE_FROM || 'onboarding@resend.dev',
          to: [TO],
          subject,
          text: lines,
          ...(email ? { reply_to: email } : {}),
        }),
      });
      if (!r.ok) {
        const d = await r.text();
        console.error('resend', r.status, d.slice(0, 300));
        return res.status(502).json({ error: 'Mail service refused' });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(501).json({ error: 'Email not configured' });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'Could not reach mail service' });
  }
}
