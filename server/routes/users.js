const express = require("express");
const connectToDatbase = require("../db");
const User = require("../models/User");
const router = express.Router();

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
      res.status(500).json({ error: `Course plan for ${userKey} not found!` });
    } else {
      res.status(200).send({ userKey: data._id, userData: data.userData });
    }
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

module.exports = router;
