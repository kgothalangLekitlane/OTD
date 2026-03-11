const License = require("../models/License");
const User = require("../models/User");
const cache = require('../utils/cache');
const CACHE_TTL = process.env.LICENSE_CACHE_TTL_MS ? parseInt(process.env.LICENSE_CACHE_TTL_MS) : 60_000;

exports.lookupByIdNumber = async (req, res) => {
  try {
    const { idNumber } = req.params;
    if (!idNumber) return res.status(400).json({ message: 'Missing idNumber' });

    // check cache first
    const cached = await cache.get(`license:${idNumber}`);
    if (cached) return res.json(cached);

    const user = await User.findOne({ idNumber })
      .select("name email idNumber role")
      .lean();
    if (!user) return res.status(404).json({ message: "Driver not found" });

    const license = await License.findOne({ userId: user._id }).lean();
    const payload = { user, license };

    // store in cache
    await cache.set(`license:${idNumber}`, payload, CACHE_TTL);
    res.json(payload);
  } catch (err) {
    console.error('Lookup license error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myLicense = async (req, res) => {
  try {
    const license = await License.findOne({ userId: req.user.id }).lean();
    res.json(license);
  } catch (err) {
    console.error('My license error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
