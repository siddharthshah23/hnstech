const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const config = require("config");
const UserRole = require("../models/UserRole");
const Auth = require("../middleware/Auth");

// @Router POST api/superadmin
// @Desc Register a SuperAdmin
// @Acess Public || Later on Private

router.post(
  "/",
  [
    check("firstname", " First Name is required").notEmpty(),
    check("lastname", " Last Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with minimum 8 character"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password, userrole } = req.body;

    try {
      let user = await User.findOne({ email: email });
      let role = await UserRole.find({ role: userrole });

      if (user) {
        return res.status(400).json({ msg: "User already existst" });
      }

      user = new User({
        firstname,
        lastname,
        email,
        password,
        role,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: role,
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

// @Router  GET api/auth
// @Desc    Get a logged in a user and Check if he is admin or not
// @Access  Private
router.get("/", Auth, async (req, res) => {
  try {
    const user = await User.find({ _id: req.user.id }).select("-password");
    console.log(user);
    const invoices = await stripe.invoices.list({
      customer: user.stripeid,
      status: "paid",
    });
    // console.log(user);
    res.json(invoices);
  } catch (error) {
    console.error(error.msg);
    res.status(500).send("Server error");
  }
});

module.exports = router;
