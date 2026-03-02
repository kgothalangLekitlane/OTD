const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ["learner", "drivers"] },
  date: Date,
  time: String,
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  testingCenter: String,
});

// index to speed up user appointment queries
appointmentSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
