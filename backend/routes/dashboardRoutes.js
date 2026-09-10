const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getOperationsSummary } = require("../controllers/dashboardController");

router.get("/operations", auth, role(["officer", "admin"]), getOperationsSummary);

module.exports = router;
