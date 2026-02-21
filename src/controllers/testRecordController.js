const TestRecord = require("../models/TestRecord");
const Athlete = require("../models/Athlete");

// ✅ Create Test Record
exports.createTestRecord = async (req, res) => {
  try {
    const { athleteId, testType, score, unit, notes, testDate } = req.body;

    // Check if athlete exists and belongs to logged-in coach
    const athlete = await Athlete.findOne({
      _id: athleteId,
      coach: req.coach._id,
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    const testRecord = await TestRecord.create({
      athlete: athleteId,
      coach: req.coach._id,
      testType,
      score,
      unit,
      notes,
      testDate,
    });

    res.status(201).json(testRecord);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Test Records for an Athlete
exports.getTestRecordsByAthlete = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {
      athlete: req.params.athleteId,
      coach: req.coach._id,
    };

    // Filter by test type
    if (req.query.testType) {
      filters.testType = req.query.testType;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      filters.testDate = {};

      if (req.query.startDate) {
        filters.testDate.$gte = new Date(req.query.startDate);
      }

      if (req.query.endDate) {
        filters.testDate.$lte = new Date(req.query.endDate);
      }
    }

    const total = await TestRecord.countDocuments(filters);

    const records = await TestRecord.find(filters)
      .sort({ testDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      records,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Analytics for Athlete
exports.getAthleteAnalytics = async (req, res) => {
  try {
    const records = await TestRecord.find({
      athlete: req.params.athleteId,
      coach: req.coach._id,
    }).sort({ testDate: 1 }); // oldest first

    if (records.length === 0) {
      return res.status(404).json({ message: "No test records found" });
    }

    const totalTests = records.length;

    const scores = records.map(r => r.score);

    const bestScore = Math.min(...scores); // assuming lower is better (like sprint)
    const averageScore =
      scores.reduce((a, b) => a + b, 0) / totalTests;

    const firstScore = records[0].score;
    const latestScore = records[records.length - 1].score;

    const improvement = firstScore - latestScore;

    res.json({
      totalTests,
      bestScore,
      averageScore: Number(averageScore.toFixed(2)),
      firstScore,
      latestScore,
      improvement,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Performance Trend (Graph Ready)
exports.getPerformanceTrend = async (req, res) => {
  try {
    const { athleteId } = req.params;

    const records = await TestRecord.find({
      athlete: athleteId,
      coach: req.coach._id,
    }).sort({ testDate: 1 }); // oldest first for proper trend

    if (records.length === 0) {
      return res.status(404).json({ message: "No test records found" });
    }

    const labels = records.map(record =>
      record.testDate.toISOString().split("T")[0]
    );

    const scores = records.map(record => record.score);

    res.json({
      labels,
      scores,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};