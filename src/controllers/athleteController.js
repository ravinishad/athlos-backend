const Athlete = require("../models/Athlete");

// ✅ Create Athlete
exports.createAthlete = async (req, res) => {
  try {
    const { name, age, gender, sport, academy, phone } = req.body;

    const athlete = await Athlete.create({
      name,
      age,
      gender,
      sport,
      academy,
      phone,
      coach: req.coach._id, // comes from protect middleware
    });

    res.status(201).json(athlete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Athletes (Only for logged-in coach)
exports.getAthletes = async (req, res) => {
  try {
    const athletes = await Athlete.find({ coach: req.coach._id });
    res.status(200).json(athletes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Athlete
exports.getAthleteById = async (req, res) => {
  try {
    const athlete = await Athlete.findOne({
      _id: req.params.id,
      coach: req.coach._id,
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    res.status(200).json(athlete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Athlete
exports.updateAthlete = async (req, res) => {
  try {
    const athlete = await Athlete.findOne({
      _id: req.params.id,
      coach: req.coach._id
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    Object.assign(athlete, req.body);
    const updated = await athlete.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Athlete
exports.deleteAthlete = async (req, res) => {
  try {
    const athlete = await Athlete.findOneAndDelete({
      _id: req.params.id,
      coach: req.coach._id,
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    res.status(200).json({ message: "Athlete deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
