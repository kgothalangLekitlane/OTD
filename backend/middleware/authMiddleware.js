const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('Missing JWT_SECRET configuration');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error', err && err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
