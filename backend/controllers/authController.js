const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const idNumber = req.body.idNumber?.trim();
    const password = req.body.password;

    if (!name || !email || !idNumber || !password) {
      return res.status(400).json({ message: "Name, email, ID number and password are required" });
    }
    if (!emailPattern.test(email)) return res.status(400).json({ message: "Enter a valid email address" });
    if (name.length < 2) return res.status(400).json({ message: "Name must contain at least 2 characters" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, idNumber, password: hashed });

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
    if (err.code === 11000) return res.status(409).json({ message: "A user with that email or ID number already exists" });
    if (err.name === "ValidationError") return res.status(400).json({ message: "Please check the registration details" });
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    if (!emailPattern.test(email)) return res.status(400).json({ message: "Enter a valid email address" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

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

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        idNumber: user.idNumber,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
};
