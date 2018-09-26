var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Radio = mongoose.model("Radio");
var Item = mongoose.model("Item");

router
  .get("/", function(req, res, next) {
    Radio.find({}, function(err, docs) {
      if (!err) {
        res.render("showcsv", {
          radios: docs
        });
      } else {
        throw err;
      }
    });
  })
  .get("/showitem/:id", function(req, res, next) {
    var idRadio = req.param("id");

    Radio.findById(idRadio, function(err, radio) {
      if (err) throw err;
      else {
        Item.find({ radio: idRadio }, function(err, items) {
          if (err) throw err;
          else
            res.render("showItems", {
              items: items,
              radioTitle: radio.title
            });
        });
      }
    });
  });

module.exports = router;
