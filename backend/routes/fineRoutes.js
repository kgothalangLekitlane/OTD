const router = require("express").Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { issueFine, getMyFines, payFine } = require("../controllers/fineController");

router.post("/issue",
  auth,
  role(["officer"]),
  [
    body('userId').isMongoId().withMessage('Valid userId required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0')
  ],
  validate,
  issueFine
);
router.get("/my", auth, getMyFines);
router.post("/pay/:fineId",
  auth,
  [param('fineId').isMongoId().withMessage('Valid fineId required')],
  validate,
  payFine
);

module.exports = router;
