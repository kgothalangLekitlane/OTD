const router = require("express").Router();
const { body, param, query } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { issueFine, getMyFines, payFine } = require("../controllers/fineController");

router.post(
  "/issue",
  auth,
  role(["officer"]),
  [
    body("userId").isMongoId().withMessage("Valid userId required"),
    body("amount").isFloat({ gt: 0, max: 1000000 }).withMessage("Amount must be greater than 0 and no more than 1000000"),
    body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description is too long")
  ],
  validate,
  issueFine
);

router.get(
  "/my",
  auth,
  [
    query("page").optional().isInt({ min: 1, max: 100000 }).withMessage("Invalid page"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Invalid limit")
  ],
  validate,
  getMyFines
);

router.post(
  "/pay/:fineId",
  auth,
  [param("fineId").isMongoId().withMessage("Valid fineId required")],
  validate,
  payFine
);

module.exports = router;
