const express = require("express");
const router = express.Router();

const { registerCoach, loginCoach } = require("../controllers/coachController");

router.post("/register", registerCoach);
router.post("/login", loginCoach);

module.exports = router;
