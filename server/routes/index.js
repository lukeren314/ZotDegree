const express = require("express");
const router = express.Router();

const usersRoute = require("./users");
const requirementsRoute = require("./requirements");
const coursesRoute = require("./courses");

router.use("/users", usersRoute);
router.use("/requirements", requirementsRoute);
router.use("/courses", coursesRoute);

module.exports = router;
