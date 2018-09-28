var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Channel = mongoose.model("Channel");
var Item = mongoose.model("Item");

router.get("/", function(req, res, next) {
  Channel.find({}, function(err, docs) {
    if (!err) {
      res.render("show", {
        channels: docs
      });
    } else {
      throw err;
    }
  });
});
router.get("/getErrors/:id", function(req, res, next) {
  var idChannel = req.param("id");
  Channel.findById(idChannel, function(err, channel) {
    if (err) throw err;
    else {
      res.send({
        data: channel.errorsMsg
      });
    }
  });
});
router.delete("/delete/:id", function(req, res, next) {
  var idChannel = req.param("id");
  Channel.findByIdAndRemove({ _id: idChannel }).exec(function(err, ch) {
    if (err) {
      console.log(err)
      res.status(500).send("error");
    }
    else if (!ch) {
      console.log("channel  not found")
      res.status(404).json({ success: false, msg: "channel not found" });
    } else {
      Item.deleteMany({ channel: idChannel }, function(err) {
        if (err){
          console.log(err)
          res.status(500).send("error");
        } 
        else {
          const response = {
            message: "channel successfully deleted",
            id: idChannel
          };
          res.send(response);
        }
      });
    }
  });
});
router.get("/details/:id", function(req, res, next) {
  var idChannel = req.param("id");
  Channel.findById(idChannel, function(err, data) {
    if (!err) {
      res.render("detailsChannel", {
        channel: data
      });
    } else {
      throw err;
    }
  });
});
router.get("/edit/:id", function(req, res, next) {
  var idChannel = req.param("id");
  Channel.findById(idChannel, function(err, data) {
    if (!err) {
      res.render("editChannel", {
        channel: data
      });
    } else {
      throw err;
    }
  });
});
router.post("/update", function(req, res, next) {
  var channel = req.body;
  Channel.findById(channel._id, function(err, channelFound) {
    if (err) return handleError(err);
    // you need to verify every element first
    channelFound._id=channel._id
    channelFound.title = channel.title;
    channelFound.categories = channel.categories;
    channelFound.author = channel.author;
    channelFound.summary = channel.summary;
    channelFound.description = channel.description;
    channelFound.language = channel.language;
    Channel.collection.save(channelFound, function(err, updatedChannel) {
      if (err) res.status(500).send("error");
      else res.send(updatedChannel);
    });
  });
});

module.exports = router;
