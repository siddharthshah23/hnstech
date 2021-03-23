const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserRole = require("../models/UserRole");
const auth = require("../middleware/Auth");

// @Router POST api/login
// @DESC Auth User and get a token
// @Acess Public

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Username" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Password" });
      }

      const userrole = await UserRole.find({
        _id: user.role,
      });

      let isAdmin = false;
      for (let i = 0; i < userrole.length; i++) {
        if (userrole[i].role === "admin") {
          isAdmin = true;
        }
      }

      if (!isAdmin) {
        return res.status(400).json({ msg: "Invalid Access" });
      }
      const payload = {
        user: {
          id: user.id,
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
      res.status(500).send("Server error");
    }
  }
);

//@Router  GET api/auth
//@Desc     Get a logged in a user
//@access   private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.find({ _id: req.user.id }).select("-password");
    res.status(200).json({ msg: user });
  } catch (error) {
    console.error(error.msg);

    res.status(400).json({ msg: "Invalid Credentials" });
  }
});

module.exports = router;
