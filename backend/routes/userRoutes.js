const router = require("express").Router();
const { query, param } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { listUsers, getUser } = require("../controllers/userController");

router.use(auth, role(["officer", "admin"]));

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1, max: 100000 }).withMessage("Invalid page"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be 1-100"),
    query("search").optional().trim().isLength({ max: 100 }).withMessage("Search is too long"),
    query("role").optional().isIn(["driver", "officer", "admin"]).withMessage("Invalid role")
  ],
  validate,
  listUsers
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid user ID")],
  validate,
  getUser
);

module.exports = router;
