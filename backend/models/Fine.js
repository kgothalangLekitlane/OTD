const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  officerId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  description: String,
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  issuedDate: Date,
  paidDate: Date
});

// index to speed up lookups for a user's fines and sorting by date
fineSchema.index({ userId: 1, issuedDate: -1 });

module.exports = mongoose.model("Fine", fineSchema);
