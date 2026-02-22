require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const testTypeRoutes = require("./src/routes/testTypeRoutes");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Register Routes
app.use("/api/test-types", testTypeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});