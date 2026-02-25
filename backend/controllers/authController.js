const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, idNumber, password, role } = req.body;
    if (!name || !email || !idNumber || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, idNumber, password: hashed, role
    });

    res.json({ message: "User registered", user });
  } catch (err) {
    console.error('Register error', err);
    if (err.code === 11000) return res.status(409).json({ message: 'User already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const secret = process.env.JWT_SECRET || 'secret123';
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
