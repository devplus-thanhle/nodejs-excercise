require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Router
app.use("/api/auth", require("./routers/authRouter"));
app.use("/api/book", require("./routers/bookRouter"));
app.use("/api/user", require("./routers/userRouter"));

//Connect MongoDB
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    // console.log("Connected to MongoDB");
  }
);

module.exports = app;
