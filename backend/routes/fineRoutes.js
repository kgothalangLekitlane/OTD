const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { issueFine, getMyFines, payFine } = require("../controllers/fineController");

router.post("/issue", auth, role(["officer"]), issueFine);
router.get("/my", auth, getMyFines);
router.post("/pay/:fineId", auth, payFine);

module.exports = router;
