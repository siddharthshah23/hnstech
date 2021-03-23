const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
    },
  ],
  bussiness: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bussiness",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
