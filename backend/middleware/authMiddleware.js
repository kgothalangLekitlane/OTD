const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.trim().split(/\s+/);

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Missing JWT_SECRET configuration");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"]
    });

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
