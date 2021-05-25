const mongoose = require("mongoose");

const User = mongoose.Schema({
  _id: String,
  userData: {
    coursePlans: [
      [
        {
          id: String,
          year: Number,
          quarter: String,
        },
      ],
    ],
    degrees: [String],
    startYear: Number,
    numYears: Number,
    checkedRequirements: [String],
  },
});

module.exports = mongoose.model("User", User);
