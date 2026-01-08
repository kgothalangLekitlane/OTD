const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createAppointment, myAppointments } = require("../controllers/appointmentController");

router.post("/", auth, createAppointment);
router.get("/my", auth, myAppointments);

module.exports = router;
