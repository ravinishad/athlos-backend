const TestRecord = require("../models/TestRecord");
const Athlete = require("../models/Athlete");
const TestType = require("../models/TestType");


// ✅ Create Test Record
exports.createTestRecord = async (req, res) => {
  try {
    const { athleteId, testTypeId, score, notes, testDate } = req.body;

    // Check if athlete exists and belongs to logged-in coach
    const athlete = await Athlete.findOne({
      _id: athleteId,
      coach: req.coach._id,
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    // Check if test type exists for this coach
    const testType = await TestType.findOne({
      _id: testTypeId,
      coach: req.coach._id,
    });

    if (!testType) {
      return res.status(404).json({ message: "Test type not found" });
    }

    const testRecord = await TestRecord.create({
      athlete: athleteId,
      coach: req.coach._id,
      testType: testTypeId,
      score,
      unit: testType.unit,
      notes,
      testDate,
    });

    res.status(201).json(testRecord);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get All Test Records for an Athlete (with pagination + filtering)
exports.getTestRecordsByAthlete = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {
      athlete: req.params.athleteId,
      coach: req.coach._id,
    };

    // Filter by testTypeId
    if (req.query.testTypeId) {
      filters.testType = req.query.testTypeId;
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
      .populate("testType")
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
    })
      .populate("testType")
      .sort({ testDate: 1 });

    if (records.length === 0) {
      return res.status(404).json({ message: "No test records found" });
    }

    const totalTests = records.length;
    const scores = records.map(r => r.score);

    // Determine best score based on test type
    const isLowerBetter = records[0].testType.isLowerBetter;

    const bestScore = isLowerBetter
      ? Math.min(...scores)
      : Math.max(...scores);

    const averageScore =
      scores.reduce((a, b) => a + b, 0) / totalTests;

    const firstScore = records[0].score;
    const latestScore = records[records.length - 1].score;

    let improvement;

    if (isLowerBetter) {
      improvement = firstScore - latestScore;
    } else {
      improvement = latestScore - firstScore;
    }

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


// ✅ Performance Trend (Fully DB-Driven Intelligence)
exports.getPerformanceTrend = async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { testTypeId } = req.query;

    const filters = {
      athlete: athleteId,
      coach: req.coach._id,
    };

    if (testTypeId) {
      filters.testType = testTypeId;
    }

    const records = await TestRecord.find(filters)
      .populate("testType")
      .sort({ testDate: 1 });

    if (records.length === 0) {
      return res.status(404).json({ message: "No test records found" });
    }

    const labels = records.map(record =>
      record.testDate.toISOString().split("T")[0]
    );

    const scores = records.map(record => record.score);

    const isLowerBetter = records[0].testType.isLowerBetter;

    let improvementPercentage = 0;
    let trend = "Stable";

    if (scores.length >= 2) {
      const firstScore = scores[0];
      const lastScore = scores[scores.length - 1];

      if (isLowerBetter) {
        improvementPercentage =
          ((firstScore - lastScore) / firstScore) * 100;
      } else {
        improvementPercentage =
          ((lastScore - firstScore) / firstScore) * 100;
      }

      improvementPercentage = Number(improvementPercentage.toFixed(2));

      if (improvementPercentage > 0) {
        trend = "Improving";
      } else if (improvementPercentage < 0) {
        trend = "Declining";
      }
    }

    res.json({
      testType: records[0].testType.name,
      labels,
      scores,
      improvementPercentage,
      trend,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};