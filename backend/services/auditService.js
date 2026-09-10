const AuditLog = require("../models/AuditLog");

const recordAudit = async ({ actorId, action, resourceType, resourceId = null, details = {} }) => {
  if (!actorId || !action || !resourceType) return;

  try {
    await AuditLog.create({ actorId, action, resourceType, resourceId, details });
  } catch (error) {
    // Auditing should never break the primary business operation.
    console.error("Audit log error", error);
  }
};

module.exports = { recordAudit };
