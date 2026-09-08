const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    licenseNumber: { type: String, trim: true, maxlength: 50 },
    expiryDate: Date,
    status: { type: String, enum: ["valid", "expired", "suspended"], default: "valid" },
    vehicleClasses: { type: [String], default: [] },
    issuedBy: { type: String, trim: true, maxlength: 120 },
    photoUrl: { type: String, trim: true, maxlength: 2048 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("License", licenseSchema);
