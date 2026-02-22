const express = require("express");
const router = express.Router();
const TestType = require("../models/TestType");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, async (req, res) => {
  try {
    const { name, unit, isLowerBetter } = req.body;

    const testType = await TestType.create({
      name,
      unit,
      isLowerBetter,
      coach: req.coach._id,
    });

    res.status(201).json(testType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;