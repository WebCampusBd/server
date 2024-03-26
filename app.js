const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/users.model");
const saltRounds = 10;
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("./config/passport");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

// home route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to home page");
});

// register route
app.get("/register", (req, res) => {
  res.status(200).send("Welcome to register page");
});
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        const newUser = new User({
          username: req.body.username,
          password: hash,
        });
        const newUserData = await newUser.save();
        res.status(201).send({
          success: true,
          message: "user is created succesfully",
          user: newUserData,
        });
      });
    } else {
      res.status(401).send({
        success: false,
        message: "Username is already taken",
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// login route
app.get("/login", (req, res) => {
  res.status(200).send("Welcome to login page");
});
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (result) {
          const payload = {
            id: user._id,
            username: user.username,
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "2d",
          });
          res.status(200).send({
            success: true,
            message: "login successfully",
            token: "Bearer " + token,
          });
        } else {
          res.status(401).send({
            success: false,
            message: "password is incorrect",
          });
        }
      });
    } else {
      res.status(401).send({
        success: false,
        message: "username is not valid",
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// profile page
app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    console.log(req.user);
    return res.status(200).send({
      success: true,
      message: "welcome to porfile page",
      user: req.user,
    });
  }
);

// 404 error handler
app.use((req, res, next) => {
  res.status(404).send("404 Not found");
});

// server error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

module.exports = app;
