// ============================================================
// SECURITY AWARENESS TRAINING DEMO
// Returns captured credentials so the trainer dashboard can
// display them during the live demo.
// ============================================================

global.captured = global.captured || [];

export default function handler(req, res) {
  res.status(200).json({
    count: global.captured.length,
    entries: global.captured
  });
}
