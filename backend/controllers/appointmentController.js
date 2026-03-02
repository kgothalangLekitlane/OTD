const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  try {
    const { type, date, time, testingCenter } = req.body;
    if (!type || !date) return res.status(400).json({ message: 'Missing required fields' });

    const appt = await Appointment.create({
      userId: req.user.id,
      type,
      date,
      time,
      testingCenter
    });

    res.json(appt);
  } catch (err) {
    console.error('Create appointment error', err);
    res.status(500).json({ message: 'Server error' });
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
    console.error('My appointments error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
