const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const trySchema = new mongoose.Schema({
  name: String,
});

const item = mongoose.model("task", trySchema);
app.get("/", function (req, res) {
  item
    .find({})
    .then((foundItems) => {
      res.render("list", { ejes: foundItems });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/", function (req, res) {
  const itemName = req.body.ele1;
  const todo5 = new item({
    name: itemName,
  });
  todo5.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checked = req.body.checkbox1;

  item
    .findByIdAndDelete(checked)
    .then(() => {
      console.log("Successfully deleted item");
      res.redirect("/");
    })
    .catch(() => {
      console.log("Error deleting item");
    });
});

app.listen("3000", function () {
  console.log("Server started on port 3000");
});
