const express = require("express");
const connectToDatbase = require("../db");
const User = require("../models/User");
const router = express.Router();
const coursesIndex = require("../../crawler/datasets/courses.json");

const MAX_COURSE_PLANS = 3;
const MAX_COURSES = 100;

router.post("/loadUserData", async (req, res) => {
  await connectToDatbase();
  try {
    if (!("userKey" in req.body)) {
      res.status(400).json({ error: "No user key provided!" });
      return;
    }
    const userKey = req.body.userKey;
    const data = await User.findById(userKey);
    if (data === null) {
      res.status(500).json({ error: `Course plan not found!` });
      return;
    }
    res
      .status(200)
      .send({ userKey: data._id, userData: getUserData(data.userData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/saveUserData", async (req, res) => {
  await connectToDatbase();
  try {
    if (!("userKey" in req.body) || !("userData" in req.body)) {
      res.status(400).json({ error: "No user key/data provided!" });
      return;
    }
    const userKey = req.body.userKey;
    const userData = req.body.userData;
    await User.findByIdAndUpdate(
      userKey,
      { $set: { _id: userKey, userData: userData } },
      { upsert: true }
    );
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getUserData(rawUserData) {
  return {
    ...rawUserData,
    coursePlans: getNewCoursePlans(rawUserData.coursePlans),
  };
}

function getNewCoursePlans(coursePlans) {
  if (coursePlans.length > MAX_COURSE_PLANS) {
    return [];
  }
  let newCoursePlans = [];
  for (let courses of coursePlans) {
    let newCourses = [];
    if (courses.length > MAX_COURSES) {
      return [];
    }
    for (let course of courses) {
      if (course.id in coursesIndex) {
        newCourses.push({
          content: coursesIndex[course.id],
          year: course.year,
          quarter: course.quarter,
        });
      }
    }
    newCoursePlans.push(newCourses);
  }
  return newCoursePlans;
}
module.exports = router;
