const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const idNumber = req.body.idNumber?.trim();
    const { password } = req.body;

    if (!name || !email || !idNumber || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      idNumber,
      password: hashed
    });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      idNumber: user.idNumber,
      role: user.role
    };

    res.status(201).json({ message: "User registered", user: safeUser });
  } catch (err) {
    console.error("Register error", err);
    if (err.code === 11000) return res.status(409).json({ message: "User already exists" });
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Missing JWT_SECRET configuration");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      secret,
      { expiresIn: "7d", algorithm: "HS256" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      idNumber: user.idNumber,
      role: user.role
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
};
