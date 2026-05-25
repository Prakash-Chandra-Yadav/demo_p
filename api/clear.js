// ============================================================
// Clears all captured credentials. Useful between demo sessions.
// ============================================================

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    await kv.del('captures');
    res.status(200).json({ ok: true, message: 'Captures cleared' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
