var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var request = require("request");
var fs = require("fs");
var xml2js = require("xml2js");
var Radio = mongoose.model("Radio");
var parser = new xml2js.Parser();
var verify = require("./verification");
var verifyitem = require("./verifItem");
var Item = mongoose.model("Item");
const https = require("https");

module.exports.parsexml = function({ url, id }, callback) {
  console.log("parsing the xml file");
  if (verify.verifyUrl(url) !== null) {
    
    console.log("url not valid");
  } else {
    request(url, function(error, response, body) {
      if (typeof body === "undefined" || body === "") {
        console.log(url)
        console.log("Url does not provide any elements");
        Radio.findById(id, function(err, radio) {
          if (!radio)
            return next(new Error('Could not load radio'));
          else {
            // do your updates here
            radio.errorsMsg.push({
              code: "404",
              msg: "the xml link does not provide any elements"
            });
            radio.valid = false;
        
            radio.save(function(err) {
              if (err)
                console.log('update error')
              else
                console.log('update success')
            });
          }
        });
      } else {
        parser.parseString(body, function(err, result) {
          if (!err) {
            console.log("parseString");
            if (typeof result["rss"] !== "undefined" && result["rss"]) {
              if (result["rss"] != null) {
                var channel = result["rss"]["channel"];
                var count = 0;
                if (typeof channel[0].item != "undefined" && channel[0].item) {
                  channel[0].item.forEach(it => {
                    count++;
                    if (count <= channel[0].item.length) {
                      xmlitem = verifyitem.verifyAndCreateItem(it);
                      // saving the items
                      xmlitem.radio=id;
                      Item.collection.insert(xmlitem, function(err, doc) {
                        if (err) {
                          console.log("err trying to save an item!");
                          console.log(err);
                        } else {
                          console.log("Done saving the items!");
                        }
                      });
                    }
                  });
                }
                else{
                  Radio.findById(id, function(err, radio) {
                    if (!radio)
                      return next(new Error('Could not load radio'));
                    else {
                      // do your updates here
                      radio.errorsMsg.push({
                        code: "405",
                        msg: "the radio does not have any items"
                      });
                      radio.valid = false;
                  
                      radio.save(function(err) {
                        if (err)
                          console.log('update error')
                        else
                          console.log('update success')
                      });
                    }
                  });
                }
              }
            }
          } else {
            console.log("this is an xml err")
            Radio.findById(id, function(err, radio) {
              if (!radio)
                return next(new Error('Could not load radio'));
              else {
                // do your updates here
                radio.errorsMsg.push({
                  code: "403",
                  msg: "there is an error in the xml format"
                });
                radio.valid = false;
            
                radio.save(function(err) {
                  if (err)
                    console.log('update error')
                  else
                    console.log('update success')
                });
              }
            });
            callback();
          }
        });
      }
    });
  }
};
