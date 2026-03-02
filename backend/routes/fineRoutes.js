const router = require("express").Router();
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { issueFine, getMyFines, payFine } = require("../controllers/fineController");

router.post("/issue",
  auth,
  role(["officer"]),
  [
    body('userId').isMongoId().withMessage('Valid userId required'),
    body('amount').isNumeric().withMessage('Amount required')
  ],
  validate,
  issueFine
);
router.get("/my", auth, getMyFines);
router.post("/pay/:fineId", auth, payFine);

module.exports = router;
