const express = require("express");
const router = express.Router();

const { registerCoach, loginCoach } = require("../controllers/coachController");
const { protect } = require("../middleware/authMiddleware");


router.post("/register", registerCoach);
router.post("/login", loginCoach);

router.get("/profile", protect, (req, res) => {
  res.json(req.coach);
});

module.exports = router;
