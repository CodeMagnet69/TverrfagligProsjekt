//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.ENCRYPTION;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] })

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
})

app.get("/login", function (req, res) {
  res.render("login");
})

app.get("/register", function (req, res) {
  res.render("register");


})

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("documentation");
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("documentation");
        }
      }
    }
  });
});

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/TverrfagligProsjekt",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

app.listen("3000", function () {
  console.log("Server started on port 3000");
})