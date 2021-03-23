const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const config = require("config");
const UserRole = require("../models/UserRole");
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
      check("firstname", " First Name is required").notEmpty(),
      check("lastname", " Last Name is required").notEmpty(),
      check("userrole", " Role is required").notEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Please enter a password with minimum 8 character"
      ).isLength({ min: 8 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstname,
      lastname,
      email,
      password,
      userrole,
      bussiness,
    } = req.body;

    try {
      let user = await User.findOne({ email: email });
      let role = await UserRole.find({ role: userrole });
      let bussinessexist = await Bussiness.find({ _id: bussiness });

      if (user) {
        return res.status(400).json({ msg: "User already existst" });
      }

      if (role.length === 0) {
        return res.status(400).json({ msg: " Role does not exist" });
      }

      if (bussinessexist.length === 0) {
        return res.status(400).json({ msg: " Bussiness does not exist" });
      }

      user = new User({
        firstname,
        lastname,
        email,
        password,
        role,
        bussiness,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          role,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// @DESC Get all users
// @Type : Get
// @Access : Private

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    // console.log(req.user.id);
    // const displayCurrent = await User.find({ _id: req.user.id });
    // console.log(displayCurrent);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
