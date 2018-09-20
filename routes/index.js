var express = require("express");

var csv = require("fast-csv");

var verify = require("./verification");
var router = express.Router();
var parser = require("./parsing");
var fs = require("fs");
const urlExists = require("url-exists");
var mongoose = require("mongoose");
var csvfile = __dirname + "/../public/files/Classeur316.58.13.csv";
var async = require("async");
var stream = fs.createReadStream(csvfile);
var Radio = mongoose.model("Radio");
var csvtojsonV2 = require("csvtojson");
var Item = mongoose.model("Item");
router.get("/import", function(req, res, next) {
  csvtojsonV2({
    delimiter: ";"
  })
    .fromFile(csvfile)
    .then(
      jsonObj => {
        var count = 0;
        async.forEachOf(jsonObj, (radio, key, callback) => {
           // saving & creating the radio
          radioaux = verify.verifyAndCreateRadio(radio);
          if (radioaux) {
           // try to verify the url from here
            const url = radioaux.rss_url;
            const id = radioaux._id;
            const status = radioaux.status;
            Radio.collection.insert(radioaux, function(err, doc) {
              if (err) {
                console.log("err trying to save an radio!");
                callback();
              } else {
                
                if (count < jsonObj.length) {
                    parser.parsexml({ url, id }, function(data) {});
                 
                  count++;
                } else {
                  return;
                }
                callback();
                console.log("Done saving the radio!");
              }
            });
          }
          else{
            console.log("the file is empty");
            radioaux.errorsMsg.push({
              code: "30",
              msg: "the file is empty"
            });
            radioaux.valid = false;
            Radio.collection.insert(radioaux, function(err, doc) {
              if (err) {
                console.log("err trying to save an radio!");
                
              } else {
                res.send("done");
              }
            });
          }
          if(count >= jsonObj.length)
          {
            res.send("done")
          }
        });
      },
      err => {
        if (err) console.error(err.message);
        callback();
      }
      
    );
});

module.exports = router;
