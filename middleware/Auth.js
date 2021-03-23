const jwt = require("jsonwebtoken");
const config = require("config");
const UserRole = require("../models/UserRole");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  // Get Token From header

  const token = req.header("x-auth-token");

  // Verify the token

  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  // Verify If the User is Admin or not
  const decoded = jwt.verify(token, config.get("jwtSecret"));
  const { id } = decoded.user;
  let user = await User.findById(id);
  let isAdmin = await UserRole.findById(user.role).select("-_id");
  console.log(isAdmin);
  if (isAdmin.role !== "admin") {
    return res.status(401).json({ msg: "Authorization denied" });
  } else {
    try {
      const decoded = jwt.verify(token, config.get("jwtSecret"));
      req.user = decoded.user;
      next();
    } catch (error) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  }
};
