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
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "high", "urgent"],
    default: "low",
  },
});

const Task = mongoose.model("task", trySchema);
app.get("/", function (req, res) {
  Task.find({})
    .then((foundItems) => {
      res.render("list", { ejes: foundItems });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/", function (req, res) {
  const { ele1: title, priority } = req.body;
  if (title.trim() !== "") {
    const newTask = new Task({ title, priority });
    newTask.save().then(() => res.redirect("/"));
  } else {
    res.redirect("/");
  }
});

app.post("/edit", function (req, res) {
  const { id, title, priority } = req.body;
  Task.findByIdAndUpdate(id, { title, priority })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.post("/delete", function (req, res) {
  const checked = req.body.checkbox1;

  Task.findByIdAndDelete(checked)
    .then(() => {
      console.log("Successfully deleted task");
      res.redirect("/");
    })
    .catch(() => {
      console.log("Error deleting task");
    });
});

app.listen("3000", function () {
  console.log("Server started on port 3000");
});
