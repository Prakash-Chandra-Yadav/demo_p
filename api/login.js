// ============================================================
// SECURITY AWARENESS TRAINING DEMO
// This serverless function captures form submissions from the
// fake login page and stores them in memory so the trainer can
// show the audience what a phishing kit collects. It is NOT
// designed to harvest real credentials and should only ever
// receive demo input from the trainer.
// ============================================================

// Simple in-memory store. Resets when the Vercel function cold-starts.
// For a demo this is fine — you want it to be ephemeral.
global.captured = global.captured || [];

export default function handler(req, res) {
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

  global.captured.push(entry);
  // Keep only the last 50 entries so memory doesn't grow forever
  if (global.captured.length > 50) {
    global.captured = global.captured.slice(-50);
  }

  console.log('[TRAINING DEMO] Credential capture:', entry);

  // Redirect victim to the "you were phished" reveal page
  res.writeHead(302, { Location: '/caught.html' });
  res.end();
}
