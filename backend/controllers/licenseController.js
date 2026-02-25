const License = require("../models/License");
const User = require("../models/User");

exports.lookupByIdNumber = async (req, res) => {
  try {
    const { idNumber } = req.params;
    if (!idNumber) return res.status(400).json({ message: 'Missing idNumber' });

    const user = await User.findOne({ idNumber });
    if (!user) return res.status(404).json({ message: "Driver not found" });

    const license = await License.findOne({ userId: user._id });
    res.json({ user, license });
  } catch (err) {
    console.error('Lookup license error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myLicense = async (req, res) => {
  try {
    const license = await License.findOne({ userId: req.user.id });
    res.json(license);
  } catch (err) {
    console.error('My license error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
