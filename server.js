const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");

// Connect Databse

connectDB();

// Init Middleware

app.use(express.json({ extended: false }));

app.use(cors());

app.get("/", (req, res) => res.send({ msg: "Welecome to HNS Tech BackEnd" }));

// Define Routes

// Verify Credentials and get token
app.use("/api/admin/", require("./routes/auth.js"));

// //Register Admin User
// app.use("/api/admin/user", require("./routes/user"));

// Register New User
app.use("/api/admin/hnstech/user", require("./routes/createnewuser"));

// Register New Bussiness
app.use("/api/admin/hnstech/organization", require("./routes/bussiness"));

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on ports ${PORT}.`);
});
