const router = require("express").Router();
const { body, query } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const auth = require("../middleware/authMiddleware");
const { createAppointment, myAppointments } = require("../controllers/appointmentController");

router.post(
  "/",
  auth,
  [
    body("type").isIn(["learner", "drivers"]).withMessage("Type must be learner or drivers"),
    body("date").isISO8601({ strict: true }).withMessage("Valid date required"),
    body("time").optional().trim().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage("Time must use HH:MM format"),
    body("testingCenter").optional().trim().isLength({ max: 200 }).withMessage("Testing center is too long")
  ],
  validate,
  createAppointment
);

router.get(
  "/my",
  auth,
  [
    query("page").optional().isInt({ min: 1, max: 100000 }).withMessage("Invalid page"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Invalid limit")
  ],
  validate,
  myAppointments
);

module.exports = router;
