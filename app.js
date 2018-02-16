"use strict";

var express = require("express");
var app = express();
var formRoutes = require("./routes/formRoutes");

var jsonParser = require("body-parser").json;
var logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

var mongoose = require("mongoose");

mongoose.connect(
 // "mongodb://digiportal-admin:digiportal-admin1234@ds211588.mlab.com:11588/digiportal-dev"
//    "mongodb://opareadams:maersk3@ds227858.mlab.com:27858/digiportal"
"mongodb://@localhost:27017/digiportal"
);



var db = mongoose.connection;

db.on("error", function(err) {
  console.error("connection error:", err);
});

db.once("open", function() {
  console.log("db connection successful");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Typ, Accepte"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/forms", formRoutes);

app.use(function(req, res, next) {
  var err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

var port = process.env.port || 3000;

app.listen(port, function() {
  console.log("Express server is listening on port", port);
});
