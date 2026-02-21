const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Routes
const coachRoutes = require("./routes/coachRoutes");
const athleteRoutes = require("./routes/athleteRoutes");
const testRecordRoutes = require("./routes/testRecordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/coaches", coachRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/test-records", testRecordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Athlos Backend Running 🚀");
});

module.exports = app;
