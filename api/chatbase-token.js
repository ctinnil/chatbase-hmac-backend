// api/chatbase-token.js
const crypto = require("crypto");

module.exports = (req, res) => {
  const { userId } = req.query;
  const secret = process.env.CHATBASE_SECRET;

  if (!userId || !secret) {
    return res.status(400).json({ error: "Missing userId or secret" });
  }

  const signature = crypto
    .createHmac("sha256", secret)
    .update(userId)
    .digest("hex");

  return res.status(200).json({ userId, signature });
};
