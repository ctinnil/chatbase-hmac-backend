export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { visitorId, timestamp, referrer, pageUrl, visitCount } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: 'Missing required visitorId' });
    }

    console.log('Visit recorded:', {
      visitorId,
      timestamp,
      referrer,
      pageUrl,
      visitCount,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    // Optional: store in database (Mongo, KV, Postgres, etc.)

    return res.status(200).json({
      success: true,
      message: 'Visit recorded successfully',
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
