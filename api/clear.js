// ============================================================
// Deletes all capture files from Vercel Blob. Use between
// demo sessions to reset the dashboard.
// ============================================================

import { list, del } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: 'captures/', limit: 1000 });

    if (blobs.length === 0) {
      return res.status(200).json({ ok: true, deleted: 0 });
    }

    const urls = blobs.map(b => b.url);
    await del(urls);

    res.status(200).json({ ok: true, deleted: urls.length });
  } catch (err) {
    console.error('[TRAINING DEMO] Blob clear error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
