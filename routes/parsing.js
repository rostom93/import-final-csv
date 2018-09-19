var express = require("express");
var router = express.Router();
var request = require("request");
var fs = require("fs");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();

var mongoose = require("mongoose");
var Item = mongoose.model("Item");
const https = require("https");

module.exports.parsexml = function({ url, id }, callback) {
  console.log("parsing the xml file");

  request(url, function(error, response, body) {
    parser.parseString(body, function(err, result) {
      if (!err) {
        console.log("parseString");
        if( typeof result["rss"] !== 'undefined' && result["rss"] )
          {
        
          if (result["rss"] != null) {
            var channel = result["rss"]["channel"];
            var count = 0;
            if(typeof channel[0].item != 'undefined' && channel[0].item ){
            channel[0].item.forEach(it => {
              count++;
              if (count <= channel[0].item.length) {
                xmlitems = new Item({
                  title: it.title,
                  link: it.link,
                  pubDate: it.pubDate,
                  description: it.description,
                  enclosure: {
                    url: it.enclosure[0]["$"]["url"],
                    length: it.enclosure[0]["$"]["length"],
                    type: it.enclosure[0]["$"]["type"]
                  },
                  author: it.author,
                  guid: it.guid,
                  radio: id,
                  category: it.category,
                  subtitle: it.itunessummary
                 
                });

                // saving the items
                // testing the url
                var lastFour = xmlitems.enclosure.url.substr(
                  xmlitems.enclosure.url.length - 4
                );
                if (
                  lastFour === ".mp3" ||
                  lastFour === ".mp4" ||
                  lastFour === ".wmv" ||
                  lastFour === ".wmv"
                ) {
                  xmlitems.valid = true;
                } else {
                  xmlitems.valid = false;
                  xmlitems.enclosure.url = null;
                  console.log("this item does not have a valid url");
                }
                Item.collection.insert(xmlitems, function(err, doc) {
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
          } else {
            console.log(err);
          }
        }
        }
      
      }
      else {
        console.log(err);
        callback();
      }
    });
  });
};
