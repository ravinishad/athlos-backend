const Athlete = require("../models/Athlete");
const TestRecord = require("../models/TestRecord");

// ✅ Dashboard Summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const coachId = req.coach._id;

    // Count athletes
    const totalAthletes = await Athlete.countDocuments({ coach: coachId });

    // Count test records
    const totalTests = await TestRecord.countDocuments({ coach: coachId });

    // Latest 5 test records
    const recentTests = await TestRecord.find({ coach: coachId })
      .populate("athlete", "name sport")
      .sort({ createdAt: -1 })
      .limit(5);

    // Latest 5 athletes added
    const latestAthletes = await Athlete.find({ coach: coachId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalAthletes,
      totalTests,
      recentTests,
      latestAthletes,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};