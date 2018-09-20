var express = require("express");
var router = express.Router();
var request = require("request");
var fs = require("fs");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();
var verify = require("./verification");
var verifyitem = require("./verifItem");
var mongoose = require("mongoose");
var Item = mongoose.model("Item");
const https = require("https");

module.exports.parsexml = function({ url, id }, callback) {
  console.log("parsing the xml file");
  if (verify.verifyUrl(url) !== null) {
    console.log(url);
    console.log("url not valid");
  } else {
    request(url, function(error, response, body) {
      if (typeof body === "undefined" || body==="") {
        console.log("Url does not provide any elements");
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

                      Item.collection.insert(xmlitem, function(err, doc) {
                        if (err) {
                          console.log("err trying to save an item!");
                          console.log(err);
                        } else {
                          console.log("Done saving the items!");
                        }
                      });
                    } else {
                      next;
                    }
                  });
                }
              }
            }
          } else {
            console.log(err);
            callback();
          }
        });
      }
    });
  }
};
