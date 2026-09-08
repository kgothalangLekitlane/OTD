const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["learner", "drivers"], required: true },
    date: { type: Date, required: true },
    time: { type: String, trim: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled", index: true },
    testingCenter: { type: String, trim: true, maxlength: 200 }
  },
  { timestamps: true }
);

appointmentSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
