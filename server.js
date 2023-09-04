//Node packages required: express, uuid, path, morgan and fs
const express = require("express");
//uuid creates unique id.  
const uuid = require("uuid").v4;
//Path changes file paths. 
const path = require("path");
//Morgan allows sight over incoming/ outgoing traffic 
const logger = require("morgan");
//file system manages file delegation
const fs = require("fs");
 
const app = express();

const PORT = process.env.PORT || 8080;
var dataNotes = [];

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(logger("dev"));

// returns file from index.js
app.get("/api/notes", function(req, res) {
  fs.readFile("db/db.json", "utf8", function(err, data) {
    //Concatenates dataNotes to the array.
    dataNotes = [].concat(JSON.parse(data));
    res.json(JSON.parse(data));
  });
});
// creates uniquie identifier and returns string data from new note.
app.post("/api/notes", function(req, res) {
  const newNote = { id: uuid(), ...req.body };
  dataNotes.push(newNote);
  fs.writeFile("db/db.json", JSON.stringify(dataNotes), function(err, data) {
    console.log(err, data);
    res.send(newNote);
  });
});
//delete function, returns "note not found" if id does not match
app.delete("/api/notes/:id", function(req, res) {
  //if dataNotes
  var note = dataNotes.find(i => i.id === req.params.id);
  if (!note) return res.send("note not found");
  var index = dataNotes.indexOf(note);
  dataNotes.splice(index, 1);
  fs.writeFile("db/db.json", JSON.stringify(dataNotes), function(err, data) {
    console.log(err, data);
    res.send(true);
  });
});

// /notes redirects to notes.html folder
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// * redirects to landing page folder
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
//port listens to 8080.
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));