const Appointment = require("../models/Appointment");

const allowedStatuses = ["scheduled", "completed", "cancelled"];

exports.createAppointment = async (req, res) => {
  try {
    const { type, date, time, testingCenter } = req.body;
    if (!type || !date) return res.status(400).json({ message: "Missing required fields" });

    const appt = await Appointment.create({
      userId: req.user.id,
      type,
      date,
      time,
      testingCenter
    });

    res.status(201).json(appt);
  } catch (err) {
    console.error("Create appointment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.myAppointments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const appts = await Appointment.find({ userId: req.user.id })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Appointment.countDocuments({ userId: req.user.id });
    res.json({ data: appts, page, limit, total });
  } catch (err) {
    console.error("My appointments error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.allAppointments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const filter = {};

    if (req.query.status) {
      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({ message: "Invalid appointment status" });
      }
      filter.status = req.query.status;
    }

    if (req.query.type) {
      if (!["learner", "drivers"].includes(req.query.type)) {
        return res.status(400).json({ message: "Invalid appointment type" });
      }
      filter.type = req.query.type;
    }

    const [data, total] = await Promise.all([
      Appointment.find(filter)
        .populate("userId", "firstName lastName email idNumber")
        .sort({ date: 1, time: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter)
    ]);

    res.json({ data, page, limit, total });
  } catch (err) {
    console.error("All appointments error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("userId", "firstName lastName email idNumber");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }
    console.error("Update appointment status error", err);
    res.status(500).json({ message: "Server error" });
  }
};
