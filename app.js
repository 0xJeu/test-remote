require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

console.log();

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})

const User = new mongoose.model("User", userSchema)

app.get("/", function (req, res) {
    res.render("home")
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})


app.post("/register", function (req,res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save()
    .then((users) => {
     try {
       res.render("secrets")
     }
     catch (error) {
       res.send(error)
     }
   })
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // console.log(username);
    // console.log(password);
    User.findOne({ email: username })
      .exec()
      .then((user) => {
        if (user && user.password === password) {
          res.render("secrets");
        } else {
          res.render("login", { error: "Invalid username or password" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.render("error", { error: "An error occurred" });
      });
  });
  


app.listen(3000, function () {
    console.log("Server started on port 3000...");
})