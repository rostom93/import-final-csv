var express = require("express");

var csv = require("fast-csv");

var router = express.Router();
var parser = require("./parsing");
var fs = require("fs");
const urlExists = require("url-exists");
var mongoose = require("mongoose");
var csvfile = __dirname + "/../public/files/Classeur316.58.13.csv";

var stream = fs.createReadStream(csvfile);
var Radio = mongoose.model("Radio");
var csvtojsonV2 = require("csvtojson");
var itemsProcessed = 0;
router.get("/import", function(req, res, next) {
  csvtojsonV2({
    delimiter: ";"
  })
    .fromFile(csvfile)
    .then(jsonObj => {
      jsonObj.forEach(radio => {
        
        radioaux = new Radio({
          cid: radio.cid,
          new_cid: radio.new_cid,
          channel_id: radio.channel_id,
          LANGUAGE: radio.LANGUAGE,
          title: radio.title,
          description: radio.description,
          Provider_id: radio.Provider_id,
          author: radio.author,
          release_date: radio.release_date,
          episode_count: radio.episode_count,
          play_count: radio.play_count,
          sub_count: radio.sub_count,
          comment_count: radio.comment_count,
          categories: radio.categories,
          keywords: radio.keywords,
          tags: radio.tags,
          rss_url: radio.rss_url,
          small_cover_url: radio.small_cover_url,
          big_cover_url: radio.big_cover_url
        });
        if (radioaux.release_date == null) {
          msg = "release_date:does not exsist";
          radioaux.valid.push({ msg });
          radioaux.release_date = new Date();
        } else if (!(radioaux.release_date instanceof Date)) {
          msg = "release_date:wrong date format";
            
          radioaux.valid.push({ msg });
          radioaux.release_date = new Date();
        }

        if (radioaux.rss_url === "") {
          msg = "rss_url:empty url";
          radioaux.status=false;
          radioaux.valid.push({ msg});
          radioaux.release_date = new Date();
        } else {
          urlExists(radioaux.rss_url, function(err, exists) {
            if (!exists) {
              msg = "rss_url:wrong url";
              radioaux.status=false;
              radioaux.valid.push({ msg });
              radioaux.release_date = new Date();
            }
          });
        }
        Radio.collection.insert(radioaux, function(err, doc) {
          if (err) {
            console.log("err trying to save an radio!");
            return;
          } else {
            if(radioaux.status){
              url = radio.rss_url;
              id=radio._id;
              //Parse Xml
              parser.parsexml({url,id}, function(data) {
                itemsProcessed++;
                if(itemsProcessed === jsonObj.length) {
                  res.send("done");
                }
                
              });
            }
           
            console.log("Done saving the radio!");
          }
        });
      });
    });
  
});
router.get("/fetchdata", function(req, res, next) {
  Radio.find({}, function(err, docs) {
    if (!err) {
      res.send(docs);
    } else {
      res.send(err);
    }
  });
});
/*router.get("/importxml", function(req, res, next) {
  Radio.find( function(err, doc) {
    if (!err) {
      var itemsProcessed = 0;

      doc.radio.forEach(radio => {
      
      });
     
    } else {
      res.send(err);
    }
  });
});*/

module.exports = router;
