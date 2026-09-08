const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    idNumber: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 254 },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["driver", "officer", "admin"], default: "driver", immutable: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
