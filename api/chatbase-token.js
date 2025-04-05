// File: api/chatbase-token.js
const crypto = require('crypto');

module.exports = async (req, res) => {
  const secret = process.env.CHATBASE_SECRET;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const signature = crypto
    .createHmac("sha256", secret)
    .update(userId)
    .digest("hex");

  return res.status(200).json({ userId, signature });
};
