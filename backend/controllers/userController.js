const User = require("../models/User");

exports.listUsers = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit || "20", 10), 1), 100);
    const search = String(req.query.search || "").trim();
    const role = String(req.query.role || "").trim().toLowerCase();

    const filter = {};
    if (["driver", "officer", "admin"].includes(role)) filter.role = role;

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(escaped, "i");
      filter.$or = [
        { name: pattern },
        { email: pattern },
        { idNumber: pattern }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email idNumber role createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    res.json({ data: users, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("List users error", err);
    res.status(500).json({ message: "Unable to load users" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email idNumber role createdAt updatedAt")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid user ID" });
    console.error("Get user error", err);
    res.status(500).json({ message: "Unable to load user" });
  }
};
