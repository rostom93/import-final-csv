var express = require("express");
var router = express.Router();
var async = require("async");
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
var i = 0;
module.exports.parsexml = function(url, id) {
  if (verify.verifyUrl(url) !== null) {
    return;
  } else {
    request(url, function(error, response, body) {
      if (typeof body === "undefined" || body === "") {
        Radio.findById(id, function(err, radio) {
          if (!radio) return next(new Error("Could not load radio"));
          else {
            // do your updates here
            radio.errorsMsg.push({
              code: "404",
              msg: "the xml link does not provide any elements"
            });
            radio.valid = false;

            radio.save(function(err) {
              if (err) console.log(err);
            });
          }
        });
      } else {
        parser.parseString(body, function(err, result) {
          if (!err) {
            if (typeof result["rss"] !== "undefined" && result["rss"]) {
              if (result["rss"] != null) {
                var channel = result["rss"]["channel"];
                if (typeof channel[0].item != "undefined" && channel[0].item) {
                  itemslength = channel[0].item.length;
                  console.log(id," this url have ");
                  console.log(itemslength);
                  
                  channel[0].item.forEach(it => {
                   
                      xmlitem = verifyitem.verifyAndCreateItem(it);
                      // saving the items
                      xmlitem.radio = id;
                      Item.collection.insertOne(xmlitem, function(err, doc) {
                        
                        if (err) {
                          console.log(err);
                        } else {
                          //done saving an item
                          return;
                        }
                      });
                   
                  });
                } else {
                  Radio.findById(id, function(err, radio) {
                    if (!radio) return next(new Error("Could not load radio"));
                    else {
                      // do your updates here
                      radio.errorsMsg.push({
                        code: "405",
                        msg: "the radio does not have any items"
                      });
                      radio.valid = false;

                      radio.save(function(err) {
                        if (err) console.log(err);
                      });
                    }
                  });
                }
              }
            }
          } else {
            Radio.findById(id, function(err, radio) {
              if (!radio) return next(new Error("Could not load radio"));
              else {
                // do your updates here
                radio.errorsMsg.push({
                  code: "403",
                  msg: "there is an error in the xml format"
                });
                radio.valid = false;

                radio.save(function(err) {
                  if (err) console.log(err);
                });
              }
            });
          }
        });
      }
    });
  }
};
