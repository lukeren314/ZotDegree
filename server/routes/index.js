const express = require("express");
const router = express.Router();

const usersRoute = require("./users");
const requirementsRoute = require("./requirements");

router.use("/users", usersRoute);
router.use("/requirements", requirementsRoute);

module.exports = router;
