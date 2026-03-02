const router = require("express").Router();
const { param } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { lookupByIdNumber, myLicense } = require("../controllers/licenseController");

router.get("/lookup/:idNumber",
  auth,
  role(["officer", "admin"]),
  [param('idNumber').isLength({ min: 3 }).withMessage('idNumber required')],
  validate,
  lookupByIdNumber
);
router.get("/me", auth, myLicense);

module.exports = router;
