const Fine = require("../models/Fine");

exports.issueFine = async (req, res) => {
  const { userId, amount, description } = req.body;

  const fine = await Fine.create({
    userId,
    officerId: req.user.id,
    amount,
    description,
    issuedDate: new Date()
  });

  res.json(fine);
};

exports.getMyFines = async (req, res) => {
  const fines = await Fine.find({ userId: req.user.id });
  res.json(fines);
};

exports.payFine = async (req, res) => {
  const { fineId } = req.params;

  await Fine.findByIdAndUpdate(fineId, {
    status: "paid",
    paidDate: new Date()
  });

  res.json({ message: "Fine paid" });
};
