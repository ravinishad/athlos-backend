const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Routes
const coachRoutes = require("./routes/coachRoutes");
const athleteRoutes = require("./routes/athleteRoutes");
app.use("/api/coaches", coachRoutes);
app.use("/api/athletes", athleteRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Athlos Backend Running 🚀");
});

module.exports = app;
