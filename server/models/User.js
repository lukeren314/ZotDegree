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
  },
});

module.exports = mongoose.model("User", User);
