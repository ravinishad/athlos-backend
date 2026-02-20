const express = require("express");
const router = express.Router();

const {
  createTestRecord,
  getTestRecordsByAthlete,
} = require("../controllers/testRecordController");

const { protect } = require("../middleware/authMiddleware");

// Create test record
router.post("/", protect, createTestRecord);

// Get all test records for an athlete
router.get("/:athleteId", protect, getTestRecordsByAthlete);

module.exports = router;