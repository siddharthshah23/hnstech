const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const auth = require("../middleware/Auth");
const Bussiness = require("../models/Bussiness");
// @DESC Post Create new user
// @Type : POST
// @Access : Private

router.post(
  "/",
  [
    auth,
    [
      check("bussinessname", " First Name is required").notEmpty(),
      //   check("lastname", " Last Name is required").notEmpty(),
      //   check("userrole", " Role is required").notEmpty(),
      //   check("email", "Please include a valid email").isEmail(),
      //   check(
      //     "password",
      //     "Please enter a password with minimum 8 character"
      //   ).isLength({ min: 8 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      bussinessname,
      streetadress,
      postalcode,
      bussinessemail,
      bussinessphone,
    } = req.body;

    try {
      let bussiness = await Bussiness.findOne({
        bussinessemail: bussinessemail,
      });

      if (bussiness) {
        return res.status(400).json({ msg: "Organization already existst !" });
      }

      bussiness = new Bussiness({
        bussinessname,
        streetadress,
        postalcode,
        bussinessemail,
        bussinessphone,
      });

      await bussiness.save();
      res.status(200).json({ msg: "Success" + bussiness });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// @DESC Get all Bussiness Information
// @Type : Get
// @Access : Private

router.get("/", auth, async (req, res) => {
  try {
    const bussiness = await Bussiness.find();
    res.json(bussiness);
    // console.log(req.user.id);
    // const displayCurrent = await User.find({ _id: req.user.id });
    // console.log(displayCurrent);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
