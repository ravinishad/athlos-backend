const mongoose = require("mongoose");

const testTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
    },
    isLowerBetter: {
      type: Boolean,
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestType", testTypeSchema);