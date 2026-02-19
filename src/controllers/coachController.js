const Coach = require("../models/Coach");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Coach
exports.registerCoach = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if coach already exists
    const existingCoach = await Coach.findOne({ email });
    if (existingCoach) {
      return res.status(400).json({ message: "Coach already exists" });
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create coach
    const coach = await Coach.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: coach._id,
      name: coach.name,
      email: coach.email,
      message: "Coach registered successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Coach
exports.loginCoach = async (req, res) => {
  try {
    const { email, password } = req.body;

    const coach = await Coach.findOne({ email });
    if (!coach) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, coach.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: coach._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      _id: coach._id,
      name: coach.name,
      email: coach.email,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
