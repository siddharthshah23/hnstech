const mongoose = require("mongoose");

const BussinessSchema = mongoose.Schema({
  bussinessname: {
    type: String,
    required: true,
  },

  streetaddress: {
    type: String,
    // required: true,
  },

  postalcode: {
    type: String,
    // required: true,
  },

  bussinessemail: {
    type: String,
    // required: true,
    unique: true,
  },
  bussinessphone: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
    // required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bussiness", BussinessSchema);
