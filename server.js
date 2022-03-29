const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 5000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/noteapp");

const noteSchema = {
  title:String,
  date: String,
  author: String,
  category: String,
  body: String,
};

const Note = mongoose.model("Note", noteSchema);

const note1 = new Note({

  date: "Created Date",
  author: "Created by",
  category: "Category",
  body: "Main content",
});

// middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  Note.find({}, (err, notes) => {
    err ? console.log(err) : console.log(notes);
    res.render("index", { notes: notes });
  });
});
app.get("/create", (req, res) => {
  res.render("create");
});
app.post("/delete", (req, res) => {
  Note.findByIdAndDelete(req.body.note_id, (err, notes) => {
    Note.find({}, (err, notes) => {
      res.render("index", { notes: notes });
    });
  });
});
app.post("/edit", (req, res) => {
  Note.find({_id: req.body.note_id}, (err, notes) => {
    console.log(notes)
    res.render("edit", { notes: notes });
  });
});

app.post('/update', (req, res) => {
  Note.findOneAndUpdate(
    { _id: req.body.updateId },
    { $set: req.body },
    (err, result) => {
      if (!err) {
        console.log("edited successfully !");
      } else {
        console.log(err);
      }
    }
  );

  Note.find({}, (err, notes)=>{

    res.redirect('/');
  })
})


app.post("/save", (req, res) => {
  let createPost = new Note(req.body);
  createPost.save();
  Note.find({}, (err, notes) => {
    res.render("index", { notes: notes });
  });
});

app.listen(port, () => {
  console.log("listening on port ", port);
});
