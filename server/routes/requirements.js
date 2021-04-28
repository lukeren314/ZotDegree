const degrees = require("../../crawler/datasets/degrees.json");
const schools = require("../../crawler/datasets/schools.json");

const express = require("express");
const router = express.Router();

router.get("/:degreeName", async (req, res) => {
  try {
    if (!req.params.degreeName) {
      res.status(400).json({ error: "Missing degreeName" });
    }
    const requirements = getRequirements(req.params.degreeName);
    if (requirements === null) {
      res.status(500).json({
        error: `Requirements for degree ${req.params.degreeName} not found`,
      });
      return;
    }
    res.status(200).send(requirements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getRequirements(degreeName) {
  if (!(degreeName in degrees)) {
    return null;
  }
  let requirements = {
    degreeRequirements: [],
    schoolName: "",
    schoolRequirements: [],
  };
  const degree = degrees[degreeName];
  requirements.degreeRequirements = degree.requirements;
  if (!(degree.school in schools)) {
    return null;
  }
  const school = schools[degree.school];
  requirements.schoolName = school.name;
  requirements.schoolRequirements = school.requirements;

  return requirements;
}

module.exports = router;
