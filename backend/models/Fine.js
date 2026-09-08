const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    officerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0.01, max: 1000000 },
    description: { type: String, trim: true, maxlength: 1000 },
    status: { type: String, enum: ["unpaid", "paid"], default: "unpaid", index: true },
    issuedDate: { type: Date, default: Date.now, index: true },
    paidDate: Date
  },
  { timestamps: true }
);

fineSchema.index({ userId: 1, issuedDate: -1 });

module.exports = mongoose.model("Fine", fineSchema);
