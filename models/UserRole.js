const mongoose = require("mongoose");

// const UserRole = mongoose.model(
//   "UserRole",
//   new mongoose.Schema({
//     name: String,
//   })
// );

const UserRoleSchema = mongoose.Schema({
  role: {
    type: String,
    default: "User",
  },
});

module.exports = mongoose.model("UserRole", UserRoleSchema);
