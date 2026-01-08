const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ["learner", "drivers"] },
  date: Date,
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  testingCenter: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
