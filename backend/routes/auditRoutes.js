const router = require("express").Router();
const { query } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { listAuditLogs } = require("../controllers/auditController");

router.get(
  "/",
  auth,
  role(["admin"]),
  [
    query("page").optional().isInt({ min: 1, max: 100000 }).withMessage("Invalid page"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Invalid limit"),
    query("action").optional().trim().isLength({ max: 100 }).withMessage("Invalid action"),
    query("resourceType").optional().trim().isLength({ max: 50 }).withMessage("Invalid resource type")
  ],
  validate,
  listAuditLogs
);

module.exports = router;
