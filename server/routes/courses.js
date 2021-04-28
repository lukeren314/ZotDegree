const departmentIndex = require("../../crawler/datasets/department_index.json");
const geIndex = require("../../crawler/datasets/ge_index.json");

const express = require("express");
const router = express.Router();

router.post("/search", (req, res) => {
  try {
    const { department, courseNum, geCategory } = req.body;
    if (
      department === undefined ||
      geCategory === undefined ||
      (department === "ALL" && geCategory === "N/A")
    ) {
      res.status(400).json({ error: "Missing department/geCategory" });
    }
    const courses = queryCourses(department, courseNum, geCategory);
    if (courses === null) {
      res.status(500).json({
        error: `Courses for department ${department} and GE Category ${geCategory} not found`,
      });
      return;
    }
    res.status(200).send(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function queryCourses(department, courseNum, geCategory) {
  if (!(department in departmentIndex)) {
    return null;
  }
  let courses = getCoursesList(department, geCategory);
  if (!courseNum) {
    return courses;
  }
  let matchedCourses = [];
  if (
    courseNum.match(/^([0-9]+[A-Za-z]* ?(- ?[0-9]+[A-Za-z]*)?)?$/g) &&
    courseNum.contains("-")
  ) {
    let tokens = courseNum.split("-");
    let bottomRange = parseInt(tokens[0]);
    let topRange = parseInt(tokens[1]);
    for (let course of courses) {
      let num = parseInt(course.number);
      if (num >= bottomRange && num <= topRange) {
        matchedCourses.push(course);
      }
    }
    return matchedCourses;
  }
  for (let course of courses) {
    if (course.number === courseNum) {
      matchedCourses.push(course);
    }
  }
  return matchedCourses;
}

function getCoursesList(department, geCategory) {
  if (department === "ALL") {
    if (!(geCategory in geIndex)) {
      return [];
    }
    return geIndex[geCategory];
  }
  let courses = departmentIndex[department];
  if (geCategory == "N/A") {
    return courses;
  }
  let matchedCourses = [];
  for (let course of courses) {
    if (course.ge_categories.includes(geCategory)) {
      matchedCourses.push(course);
    }
  }
  return matchedCourses;
}

module.exports = router;
