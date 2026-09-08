const router = require("express").Router();
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validateMiddleware");
const { register, login } = require("../controllers/authController");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.AUTH_RATE_LIMIT_MAX || "10", 10),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again later" }
});

router.use(authLimiter);

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 1, max: 100 }).withMessage("Name required"),
    body("email").trim().isEmail().normalizeEmail().withMessage("Valid email required"),
    body("idNumber").trim().isLength({ min: 3, max: 50 }).withMessage("ID number required"),
    body("password").isLength({ min: 8, max: 128 }).withMessage("Password must be 8-128 characters")
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 1, max: 128 }).withMessage("Password required")
  ],
  validate,
  login
);

module.exports = router;
