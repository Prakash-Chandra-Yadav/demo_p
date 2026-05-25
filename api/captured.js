// ============================================================
// SECURITY AWARENESS TRAINING DEMO
// Lists all capture files in Vercel Blob and returns the
// parsed entries for the trainer dashboard.
// ============================================================

import { list } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: 'captures/', limit: 100 });

    // Fetch each blob's JSON contents in parallel
    const entries = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const r = await fetch(blob.url);
          if (!r.ok) return null;
          return await r.json();
        } catch {
          return null;
        }
      })
    );

    const valid = entries.filter(Boolean);
    // Sort newest first
    valid.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    res.status(200).json({
      count: valid.length,
      entries: valid
    });
  } catch (err) {
    console.error('[TRAINING DEMO] Blob read error:', err);
    res.status(200).json({ count: 0, entries: [], error: err.message });
  }
}
