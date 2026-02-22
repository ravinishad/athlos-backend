const mongoose = require("mongoose");

const testRecordSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
   testType: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "TestType",
  required: true,
},
    score: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    testDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestRecord", testRecordSchema);