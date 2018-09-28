var express = require("express");
var router = express.Router();
var async = require("async");
var mongoose = require("mongoose");
var request = require("request");
var fs = require("fs");
var xml2js = require("xml2js");
var Channel = mongoose.model("Channel");
var parser = new xml2js.Parser();
var verify = require("./verification");
var verifyitem = require("./verifItem");
var Item = mongoose.model("Item");
const https = require("https");

var i = 0;

module.exports.parsexml = function(url, id) {
  if (verify.verifyUrlcsv(url) !== null) {
    console.log(url, " this is an unvalid url");
    return;
  } else {
    request({ method: "GET",url: url, followAllRedirects: true }, function(
      error,
      response,
      body
    ) {
      if (typeof body === "undefined" || body === null) {
        console.log(url, " this is an empty channel");
        Channel.findById(id, function(err, channel) {
          if (err) console.log(err);
          else {
            // do your updates here
            channel.errorsMsg.push({
              code: "404",
              msg: "the xml link does not provide any elements"
            });
            channel.valid = false;

            channel.save(function(err) {
              if (err) console.log(err);
            });
          }
        });
      } else {
        parser.parseString(body, function(err, result) {
          if (!err) {
            if (
              typeof result["rss"] !== "undefined" &&
              result["rss"] !== null
            ) {
              if (result["rss"] !== null) {
                var channel = result["rss"]["channel"];
                if (
                  typeof channel[0].item !== "undefined" &&
                  channel[0].item !== null
                ) {
                  itemslength = channel[0].item.length;
                  console.log(url, " this url have ", itemslength);
                  async.forEachSeries(channel[0].item, (it, callback) => {
                    xmlitem = verifyitem.verifyAndCreateItem(it);
                    // saving the items
                    xmlitem.channel = id;

                    Item.collection.insert(xmlitem, function(err, doc) {
                      if (err) {
                        console.log("err");
                        callback();
                      } else {
                        console.log("done item");
                        callback();
                      }
                    });
                  });
                } else {
                  Channel.findById(id, function(err, channel) {
                    if (channel) {
                      // do your updates here
                      channel.errorsMsg.push({
                        code: "405",
                        msg: "the channel does not have any items"
                      });
                      channel.valid = false;

                      channel.save(function(err) {
                        if (err) console.log(err);
                      });
                    }
                  });
                }
              }
            }
          } else {
            Channel.findById(id, function(err, channel) {
              if (channel) {
                // do your updates here
                channel.errorsMsg.push({
                  code: "403",
                  msg: "there is an error in the xml format"
                });
                channel.valid = false;

                channel.save(function(err) {
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
