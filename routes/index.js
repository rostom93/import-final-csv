var express = require("express");

var csv = require("fast-csv");

var verify = require("../public/javascripts/verification");
var router = express.Router();
var parse = require("../public/javascripts/parsing");
var fs = require("fs");
var mongoose = require("mongoose");
var request = require("request")

var Channel = mongoose.model("Channel");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();
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
          var i = 0;
          async.forEachSeries(jsonObj, (radio, callback) => {
            // saving & creating the radio
            radioaux = verify.verifyAndCreateRadio(radio);
            if (radioaux) {
              
              Radio.findOne({ title: radio.title }, function(err, rad) {
                if (rad) {
                  console.log("found this radio",radio.title)
                  radioaux._id = rad._id;
                  rad = radioaux;
                  const url = radioaux.rss_url;
                  const id = radioaux._id;
                  Radio.collection.save(rad, function(err) {
                    if (err) {
                      console.log("err trying to save an radio!");
                      console.log(i);
                      i++;
                      callback();
                    } else {
                      
                      callback();
                    }
                  });
                } else {
                  Radio.collection.insert(radioaux, function(err, doc) {
                    const url = radioaux.rss_url;
                    const id = radioaux._id;
                    if (err) {
                      console.log("err trying to save an radio!");
                      console.log(i);
                      i++;
                      callback();
                    } else {
                      parse.parsexml(url, id);
                      callback();
                    }
                  });
                }
              });
            } else {
              console.log("the file is empty");
              radioaux.errorsMsg.push({
                code: "30",
                msg: "the file is empty"
              });
              radioaux.valid = false;
              Radio.collection.insert(radioaux, function(err, doc) {
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
  })
  .post("/importxml", function(req, res, next) {
    console.log("parsing the xml file");
    var url = req.body.url;
    console.log(url);
    //parsing the xml
    request({ method: "GET",url: url, followAllRedirects: true }, function(
      error,
      response,
      text
    ) {
      if (error) {
        throw error;
      } else {
        console.log(text)
        fs.writeFileSync( __dirname + "/../public/files/file.xml", text);
        parser.parseString(text, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            
            if (!verify.verifyChannel(result)) {
              xmlchannel = new Channel();
              xmlchannel.valid = false;
              errorsMsg = {
                code: "10",
                msg: "Channel does not exsist"
              };
              xmlchannel.errorsMsg.push(errorsMsg);
              Channel.collection.insert(xmlchannel, function(err, doc) {
                if (err) {
                  console.log("err trying to save the channel!");
                  return;
                } else {
                  console.log("Done saving the channel");
                  res.send("done saving the channel");
                }
              });
            } else {
              var channel = result["rss"]["channel"];
              channel.valid = true;
              xmlchannel = verify.verifyAndCreateChannel(channel);
              Channel.findOne({ title: channel[0].title }, function(err, ch) {
                if (ch) {
                  xmlchannel._id = ch._id;
                  ch = xmlchannel;
                  Channel.collection.save(ch, function(err) {
                    if (err) throw err;
                    else res.send("done updating the channel");
                  });
                } else {
                  if (verify.verifyItemExsist(channel)) {
                    channel[0].item.forEach(it => {
                      xmlitems = verify.verifyAndCreateItem(it);
                      xmlitems.channel = xmlchannel._id;
                      //saving the item
                      Item.collection.insert(xmlitems, function(err, doc) {
                        if (err) {
                          console.log("err trying to save an item!");
                          return;
                        } else {
                          console.log("Done saving the items!");
                        }
                      });
                    });
                  } else {
                    xmlchannel.valid = false;
                    errorsMsg = {
                      code: "100",
                      msg: "Channel does not have any item"
                    };
                    xmlchannel.errorsMsg.push(errorsMsg);
                  }
                  Channel.collection.insert(xmlchannel, function(err, doc) {
                    if (err) {
                      console.log("err trying to save the channel!");
                      return;
                    } else {
                      console.log("Done saving the channel");
                      res.send("done saving the channel");
                    }
                  });
                }
              });
              
             
            }

          
          }
        });
      }
    });
  });
router.post("/", upload.single("inputfile"), function(req, res) {
  res.redirect("/import");
});

module.exports = router;
