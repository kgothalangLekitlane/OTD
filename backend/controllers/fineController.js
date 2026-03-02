const Fine = require("../models/Fine");

exports.issueFine = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    if (!userId || !amount) return res.status(400).json({ message: 'Missing required fields' });

    const fine = await Fine.create({
      userId,
      officerId: req.user.id,
      amount,
      description,
      issuedDate: new Date()
    });

    res.json(fine);
  } catch (err) {
    console.error('Issue fine error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyFines = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const fines = await Fine.find({ userId: req.user.id })
      .sort({ issuedDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Fine.countDocuments({ userId: req.user.id });
    res.json({ data: fines, page, limit, total });
  } catch (err) {
    console.error('Get my fines error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.payFine = async (req, res) => {
  try {
    const { fineId } = req.params;
    if (!fineId) return res.status(400).json({ message: 'Missing fineId' });

    await Fine.findByIdAndUpdate(fineId, {
      status: "paid",
      paidDate: new Date()
    });

    res.json({ message: "Fine paid" });
  } catch (err) {
    console.error('Pay fine error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
