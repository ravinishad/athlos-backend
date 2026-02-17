const Coach = require("../models/Coach");

// Register Coach
const registerCoach = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const coachExists = await Coach.findOne({ email });

    if (coachExists) {
      return res.status(400).json({ message: "Coach already exists" });
    }

    const coach = await Coach.create({
      name,
      email,
      password,
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

module.exports = { registerCoach };
