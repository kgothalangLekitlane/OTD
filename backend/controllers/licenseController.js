const License = require("../models/License");
const User = require("../models/User");

exports.lookupByIdNumber = async (req, res) => {
  const { idNumber } = req.params;
  const user = await User.findOne({ idNumber });
  if (!user) return res.status(404).json({ message: "Driver not found" });

  const license = await License.findOne({ userId: user._id });
  res.json({ user, license });
};

exports.myLicense = async (req, res) => {
  const license = await License.findOne({ userId: req.user.id });
  res.json(license);
};
