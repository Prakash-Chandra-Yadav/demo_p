// ============================================================
// SECURITY AWARENESS TRAINING DEMO
// Returns captured credentials from Vercel KV so the trainer
// dashboard can display them during the live demo.
// ============================================================

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Fetch all entries (lpush + ltrim keeps newest first, max 50)
    const raw = await kv.lrange('captures', 0, -1);
    const entries = raw.map(item => {
      try {
        return typeof item === 'string' ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    }).filter(Boolean);

    res.status(200).json({
      count: entries.length,
      entries: entries
    });
  } catch (err) {
    console.error('[TRAINING DEMO] KV read error:', err);
    res.status(200).json({ count: 0, entries: [], error: err.message });
  }
}
