var express = require("express");

var csv = require("fast-csv");

var verify = require("../public/javascripts/verification");
var router = express.Router();
var parser = require("../public/javascripts/parsing");
var fs = require("fs");
const urlExists = require("url-exists");
var mongoose = require("mongoose");

var async = require("async");
var Radio = mongoose.model("Radio");
var csvtojsonV2 = require("csvtojson");
var Item = mongoose.model("Item");
var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../public/files");
  },
  filename: (req, file, cb) => {
    cb(null, "file.csv");
  }
});
var upload = multer({ storage: storage });
router
  .get("/", function(req, res, next) {
    res.render("index", { title: "Import CSV using NodeJS" });
  })
  .get("/import", function(req, res, next) {
    var csvfile = __dirname + "/../public/files/file.csv";
    
var stream = fs.createReadStream(csvfile);
    csvtojsonV2({
      delimiter: ";"
    })
      .fromFile(csvfile)
      .then(
        jsonObj => {
          async.forEachSeries(jsonObj, (radio, callback) => {
            // saving & creating the radio
            radioaux = verify.verifyAndCreateRadio(radio);
            if (radioaux) {
              const url = radioaux.rss_url;
              const id = radioaux._id;
              Radio.collection.insertOne(radioaux, function(err, doc) {
                if (err) {
                  console.log("err trying to save an radio!");
                  callback();
                } else {
                  parser.parsexml(url, id);
                  callback();
                }
              });
            } else {
              console.log("the file is empty");
              radioaux.errorsMsg.push({
                code: "30",
                msg: "the file is empty"
              });
              radioaux.valid = false;
              Radio.collection.insertOne(radioaux, function(err, doc) {
                if (err) {
                  console.log("err trying to save an radio!");
                  callback();
                } else {
                  
                  callback();
                }
              });
            }
          });
          
        },
        err => {
          if (err) console.error(err.message);
        }
      );
      res.redirect("/showcsv");
  });
router.post("/", upload.single("inputfile"), function(req, res) {
  res.redirect("/import");
});


module.exports = router;
