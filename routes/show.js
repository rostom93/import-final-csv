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
  })
  router.delete("/delete/:id",function(req, res, next){
    var idChannel = req.param("id");
    Channel.findByIdAndRemove(idChannel , function (err) {
      if (err) res.status(500).send("error");
      // deleted at most one tank document
      else{
        Item.deleteMany({channel: idChannel},function(err){
          if (err) res.status(500).send("error");
          else{
            const response = {
              message: "channel successfully deleted",
              id: idChannel
          };
            res.send(response);
          }
        })
        
      } 
    });
  })

module.exports = router;
