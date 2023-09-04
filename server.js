// Dependencies
const express = require("express");
const fs = require("fs");


// Sets up the express app
var app = express();
var PORT = process.env.PORT || 3001;

// Sets up the express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public/assets", express.static(__dirname + "/public/assets"));


require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes.js")(app);

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});