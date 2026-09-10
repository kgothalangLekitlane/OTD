const AuditLog = require("../models/AuditLog");

exports.listAuditLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 25);
    const filter = {};

    if (req.query.action) filter.action = req.query.action;
    if (req.query.resourceType) filter.resourceType = req.query.resourceType;

    const [data, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("actorId", "name email role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter)
    ]);

    res.json({ data, page, limit, total });
  } catch (error) {
    console.error("List audit logs error", error);
    res.status(500).json({ message: "Server error" });
  }
};
