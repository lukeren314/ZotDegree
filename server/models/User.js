const mongoose = require("mongoose");

const User = mongoose.Schema({
  _id: String,
  userData: {
    coursePlans: [
      {
        yearPlans: [
          {
            quarterPlans: {
              courses: [String],
            },
          },
        ],
        degrees: [String],
        startYear: Number,
        numYears: Number,
      },
    ],
  },
});

module.exports = mongoose.model("User", User);
