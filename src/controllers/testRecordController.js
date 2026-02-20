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
    const records = await TestRecord.find({
      athlete: req.params.athleteId,
      coach: req.coach._id,
    })
.populate("athlete", "name sport age")
.sort({ testDate: -1 });

    res.status(200).json(records);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};