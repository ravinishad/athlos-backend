const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Athlos Backend Running 🚀");
});

module.exports = app;
