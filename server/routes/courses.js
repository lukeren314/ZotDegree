const express = require("express");
const router = express.Router();

console.log("Setting up course indexes");
const departmentIndex = toIndex(
  require("../../crawler/datasets/department_index.json")
);
const geIndex = toIndex(require("../../crawler/datasets/ge_index.json"));
const coursesIndex = require("../../crawler/datasets/courses.json");

function toIndex(data) {
  let index = {};
  for (let key in data) {
    index[key] = new Set(data[key]);
  }
  return index;
}

router.post("/search", (req, res) => {
  try {
    const { department, courseNumber, geCategories } = req.body;
    if (department === "ALL" && geCategories === []) {
      res.status(400).json({ error: "Missing Department/GECategory" });
    }
    const queriedCourses = queryCourses(department, courseNumber, geCategories);
    if (queriedCourses === null) {
      res.status(500).json({
        error: `Courses for Dept. ${department} and GEs ${geCategories.join(',')} not found`,
      });
      return;
    }
    res.status(200).send(queriedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getCourse/:courseId", (req, res) => {
  try {
    const course = getCourse(req.params.courseId);
    if (course === null) {
      res.status(500).json({
        error: `Course with id ${courseId} not found`,
      });
      return;
    }
    res.status(200).send({course: course});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function queryCourses(department, courseNum, geCategories) {
  if (!(department in departmentIndex)) {
    return null;
  }
  let courseIds = getCourseIds(department, geCategories);
  if (courseNum) {
    courseIds = getMatchedIds(courseIds, courseNum.toUpperCase());
  }
  let courses = getCourses(courseIds);
  return courses;
}

function getCourseIds(department, geCategories) {
  if (department === "ALL") {
    return getGeCategoryIds(geCategories);
  }
  if (!(department in departmentIndex)) {
    return [];
  }
  let courseIdsSet = departmentIndex[department];
  for (let ge of geCategories) {
    if (!(ge in geIndex)) {
      continue;
    }
    courseIdsSet = new Set([...courseIdsSet].filter((x) => geIndex[ge].has(x)));
  }
  return [...courseIdsSet];
}

function getGeCategoryIds(geCategories) {
  let courseIdsSet = geIndex[geCategories[0]];
  for (let i = 1; i < geCategories.length; ++i) {
    courseIdsSet = new Set(
      [...courseIdsSet].filter((x) => geIndex[geCategories[i]].has(x))
    );
  }
  return [...courseIdsSet];
}

function getMatchedIds(courseIds, courseNum) {
  if (!courseNum.match(/^([0-9]+[A-Za-z]* ?(- ?[0-9]+[A-Za-z]*)?)?$/g)) {
    return [];
  }
  if (courseNum.includes("-")) {
    return matchRange(courseIds, courseNum);
  }
  return matchId(courseIds, courseNum);
}

function matchRange(courseIds, courseNum) {
  let matchedIds = [];
  let tokens = courseNum.split("-");
  let bottomRange = parseInt(tokens[0]);
  let topRange = parseInt(tokens[1]);
  for (let courseId of courseIds) {
    let num = parseInt(getCourseNumber(courseId));
    if (num >= bottomRange && num <= topRange) {
      matchedIds.push(courseId);
    }
  }
  return matchedIds;
}

function matchId(courseIds, courseNum) {
  let matchedIds = [];
  for (let courseId of courseIds) {
    if (getCourseNumber(courseId) === courseNum) {
      matchedIds.push(courseId);
    }
  }
  return matchedIds;
}

function getCourseNumber(courseId) {
  let tokens = courseId.split(" ");
  return tokens[tokens.length - 1];
}

function getCourses(courseIds) {
  let courses = [];
  for (let courseId of courseIds) {
    if (courseId in coursesIndex) {
      courses.push(getCourse(courseId));
    }
  }
  return courses;
}

function getCourse(courseId) {
  return coursesIndex[courseId];
}

module.exports = router;
