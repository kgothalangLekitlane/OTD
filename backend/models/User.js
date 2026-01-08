const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  idNumber: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["driver", "officer", "admin"], default: "driver" }
});

module.exports = mongoose.model("User", userSchema);
