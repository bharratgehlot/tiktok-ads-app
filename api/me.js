export default function handler(req, res) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({
    success: true,
    user: {
      name: "TikTok Ads User",
    },
  });
}
