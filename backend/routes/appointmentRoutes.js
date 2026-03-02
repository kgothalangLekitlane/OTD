const router = require("express").Router();
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const auth = require("../middleware/authMiddleware");
const { createAppointment, myAppointments } = require("../controllers/appointmentController");

router.post("/",
  auth,
  [
    body('type').isIn(['learner','drivers']).withMessage('Type must be learner or drivers'),
    body('date').isISO8601().withMessage('Valid date required'),
    body('time').optional().isString().withMessage('Time must be a string')
  ],
  validate,
  createAppointment
);
router.get("/my", auth, myAppointments);

module.exports = router;
