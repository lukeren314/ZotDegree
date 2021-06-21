const degrees = require("../../crawler/datasets/degrees.json");
const schools = require("../../crawler/datasets/schools.json");
const universalRequirements = require("../../crawler/datasets/universal_requirements.json");

const express = require("express");
const router = express.Router();
const MAX_DEGREES = 10;

router.post("/", (req, res) => {
  try {
    if (!req.body.degreeNames) {
      res.status(400).json({ error: "Missing Degree Names" });
    }
    const requirements = getRequirements(req.body.degreeNames);
    if (requirements === null) {
      res.status(500).json({
        error: `Requirements for degrees ${req.body.degreeNames.join(
          ","
        )} not found`,
      });
      return;
    }
    res.status(200).send(requirements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getRequirements(degreeNames) {
  let requirements = [
  ];
  if (degreeNames.length > MAX_DEGREES) {
    return requirements;
  }
  let schoolNames = [];
  for (let degreeName of degreeNames) {
    if (!(degreeName in degrees)) {
      continue;
    }
    const degree = degrees[degreeName];
    requirements.push({
      name: degree.name,
      requirementsLists: degree.requirements,
    });
    if (
      degree.school in schools &&
      schools[degree.school].requirements.length > 0 &&
      !schoolNames.includes(degree.school)
    ) {
      schoolNames.push(degree.school);
    }
  }
  for (let schoolName of schoolNames) {
    requirements.push({
      name: schoolName,
      requirementsLists: schools[schoolName].requirements,
    });
  }
  return requirements;
}

module.exports = router;
