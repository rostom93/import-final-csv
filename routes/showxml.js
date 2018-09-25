var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var channel = mongoose.model("Channel");
var Item = mongoose.model("Item");

router
  .get("/", function(req, res, next) {
    channel.find({}, function(err, docs) {
      if (!err) {
        res.render("showxml", {
          channels: docs
        });
      } else {
        throw err;
      }
    });
  })
  .get("/showitem/:id", function(req, res, next) {
    var idChannel = req.param("id");
    Item.find({ channel: idChannel }, function(err, items) {
      if (err) throw err;
      else
        res.render("showItems", {
          items: items
        });
    });
  });

module.exports = router;
