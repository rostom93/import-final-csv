var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var channel = mongoose.model("Channel");
var Item = mongoose.model("Item");


router.get('/', function(req, res, next) {
    res.render('showxml', { title: 'list of Channels' });
  }).get('/list',function(req, res, next){
    channel.find({}, function(err, docs) {
        if (!err){ 
            res.json({success : "fetch Successfully", status : 200, data: docs});
        } else { 
            throw err;
        }
    });
  }).get('/show/:id',function(req, res, next){
    var idChannel = req.param('id');
    Item.find({channel:idChannel},function(err, items) {
            if (err)
                res.send(err);

                res.json({success : "fetch Successfully", status : 200, data: items});
       
        });
  })

module.exports = router;
