const express = require("express");
const router = express.Router();
const UserRole = require("../models/UserRole");

router.post("/", async (req, res) => {
  const { role } = req.body;

  try {
    userrole = new UserRole({
      role,
    });
    await userrole.save();
    res.status(200).json({ msg: role });
  } catch (error) {
    console.error(error);
  }

  res.status(500).json({ msg: "Server error" });
});

module.exports = router;
