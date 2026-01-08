const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { lookupByIdNumber, myLicense } = require("../controllers/licenseController");

router.get("/lookup/:idNumber", auth, role(["officer", "admin"]), lookupByIdNumber);
router.get("/me", auth, myLicense);

module.exports = router;
