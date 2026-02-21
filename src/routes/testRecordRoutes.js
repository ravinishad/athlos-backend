const express = require("express");
const router = express.Router();

const {
  createTestRecord,
  getTestRecordsByAthlete,
  getAthleteAnalytics,
  getPerformanceTrend,
} = require("../controllers/testRecordController");

const { protect } = require("../middleware/authMiddleware");

// Create test record
router.post("/", protect, createTestRecord);

// Analytics
router.get("/analytics/:athleteId", protect, getAthleteAnalytics);

// Trend (Graph-ready)
router.get("/trend/:athleteId", protect, getPerformanceTrend);

// Get paginated & filtered test records
router.get("/:athleteId", protect, getTestRecordsByAthlete);

module.exports = router;