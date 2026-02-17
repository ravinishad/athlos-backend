const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Routes
const coachRoutes = require("./routes/coachRoutes");
app.use("/api/coaches", coachRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Athlos Backend Running 🚀");
});

module.exports = app;
