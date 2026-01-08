const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  licenseNumber: String,
  expiryDate: Date,
  status: { type: String, enum: ["valid", "expired", "suspended"], default: "valid" },
  vehicleClasses: [String],
  issuedBy: String,
  photoUrl: String,
});

module.exports = mongoose.model("License", licenseSchema);
