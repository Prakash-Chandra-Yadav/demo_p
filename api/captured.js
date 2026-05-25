// ============================================================
// SECURITY AWARENESS TRAINING DEMO
// Lists all capture files in private Vercel Blob storage and
// returns parsed entries. Uses get() server-side because
// private blobs cannot be fetched directly via HTTP URLs.
// ============================================================

import { list, get } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: 'captures/', limit: 100 });

    // Fetch each private blob's contents server-side (the SDK
    // attaches the auth token automatically on Vercel)
    const entries = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const r = await get(blob.pathname, { access: 'private' });
          // get() returns a ReadableStream; convert to text then parse
          const text = await streamToText(r.stream);
          return JSON.parse(text);
        } catch (err) {
          console.error('[TRAINING DEMO] Failed to read blob:', blob.pathname, err.message);
          return null;
        }
      })
    );

    const valid = entries.filter(Boolean);
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

async function streamToText(stream) {
  const reader = stream.getReader();
  const chunks = [];
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(decoder.decode(value, { stream: true }));
  }
  chunks.push(decoder.decode());
  return chunks.join('');
}
