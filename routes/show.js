var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Channel = mongoose.model("Channel");
var Item = mongoose.model("Item");

router
  .get("/", function(req, res, next) {
    Channel.find({}, function(err, docs) {
      if (!err) {
        res.render("show", {
          channels: docs
        });
      } else {
        throw err;
      }
    });
  })
  .get("/showitem/:id", function(req, res, next) {
    var idChannel = req.param("id");

    Channel.findById(idChannel, function(err, channel) {
      if (err) throw err;
      else {
        Item.find({ channel: idChannel }, function(err, items) {
          if (err) throw err;
          else
            res.render("showItems", {
              items: items,
              channelTitle: channel.title
            });
        });
      }
    });
  }).get("/getErrors/:id",function(req, res, next){
    var idChannel = req.param("id");
    Channel.findById(idChannel, function(err, channel) {
      if (err) throw err;
      else {
       
            res.send({
              data:channel.errorsMsg
            });
        
      }
    });
  })

module.exports = router;
