var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Channel = mongoose.model("Channel");
var Item = mongoose.model("Item");

router
  .get("/", function(req, res, next) {
    res.render("showItems");
  })
  .get("/:id", function(req, res, next) {
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
  });
router.get("/getErrorsItem/:id", function(req, res, next) {
  var iditem = req.param("id");

  Item.findById(iditem, function(err, item) {
    if (err) throw err;
    else {
      res.send({
        data: item.errorsMsg
      });
    }
  });
});
router.delete("/delete/:id", function(req, res, next) {
  var iditem = req.param("id");
  Item.findByIdAndRemove({ _id: iditem }).exec(function(err, item) {
    if (err) res.status(500).send("error");
    else if (!item) {
      res.status(404).json({ success: false, msg: "item not found" });
    } else {
      const response = {
        message: "item successfully deleted",
        id: iditem
      };
      res.send(response);
    }
  });
});
router.get("/details/:id", function(req, res, next) {
  var idItem = req.param("id");
  Item.findById(idItem, function(err, data) {
    if (!err) {
      res.render("detailsItem", {
        item: data
      });
    } else {
      throw err;
    }
  });
})
router.get("/edit/:id", function(req, res, next) {
  var idItem = req.param("id");
  Item.findById(idItem, function(err, data) {
    if (!err) {
      res.render("editItem", {
        item: data
      });
    } else {
      throw err;
    }
  });
})
module.exports = router;
