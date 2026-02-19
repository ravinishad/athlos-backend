const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    sport: {
      type: String,
      required: true,
    },
    academy: {
      type: String,
    },
    phone: {
      type: String,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Athlete", athleteSchema);
