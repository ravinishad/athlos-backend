const express = require("express");
const router = express.Router();
const { registerCoach } = require("../controllers/coachController");

// POST /api/coaches/register
router.post("/register", registerCoach);

module.exports = router;
