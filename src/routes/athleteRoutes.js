const express = require("express");
const router = express.Router();

const {
  createAthlete,
  getAthletes,
  getAthleteById,
  updateAthlete,
  deleteAthlete,
} = require("../controllers/athleteController");

const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.post("/", protect, createAthlete);
router.get("/", protect, getAthletes);
router.get("/:id", protect, getAthleteById);
router.delete("/:id", protect, deleteAthlete);
router.put("/:id", protect, updateAthlete);

module.exports = router;
