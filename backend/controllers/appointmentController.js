const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  try {
    const { type, date, testingCenter } = req.body;
    if (!type || !date) return res.status(400).json({ message: 'Missing required fields' });

    const appt = await Appointment.create({
      userId: req.user.id,
      type,
      date,
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
    const appts = await Appointment.find({ userId: req.user.id });
    res.json(appts);
  } catch (err) {
    console.error('My appointments error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
