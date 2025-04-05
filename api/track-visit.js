export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { visitorId, timestamp, referrer, pageUrl, visitCount } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: 'Missing required visitorId' });
    }

    const redisKey = `visit:${visitorId}`;
    const redisUrl = `${process.env.KV_REST_API_URL}/set/${encodeURIComponent(redisKey)}`;
    const headers = {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json'
    };

    const redisValue = {
      timestamp,
      referrer,
      pageUrl,
      count: visitCount
    };

    await fetch(redisUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ value: JSON.stringify(redisValue) })
    });

    return res.status(200).json({
      success: true,
      message: 'Visit recorded and stored in Redis',
      personalization: {
        showWelcomeBack: visitCount > 1,
        visitCount
      }
    });

  } catch (error) {
    console.error('Error tracking visit:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
