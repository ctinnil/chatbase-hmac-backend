export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const secret = process.env.CHATBASE_SECRET;

  if (!userId || !secret) {
    return new Response(JSON.stringify({ error: 'Missing userId or secret' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const data = encoder.encode(userId);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureArrayBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data);
  const hashArray = Array.from(new Uint8Array(signatureArrayBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return new Response(JSON.stringify({ userId, signature }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
