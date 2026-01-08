const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  const { type, date, testingCenter } = req.body;

  const appt = await Appointment.create({
    userId: req.user.id,
    type,
    date,
    testingCenter
  });

  res.json(appt);
};

exports.myAppointments = async (req, res) => {
  const appts = await Appointment.find({ userId: req.user.id });
  res.json(appts);
};
