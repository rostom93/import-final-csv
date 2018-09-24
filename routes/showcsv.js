var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Radio = mongoose.model("Radio");


router.get('/', function(req, res, next) {
    res.render('showcsv', { title: 'list of radios' });
  }).get('/list',function(req, res, next){
    Radio.find({}, function(err, docs) {
        if (!err){ 
            res.json({success : "fetch Successfully", status : 200, data: docs});
        } else { 
            throw err;
        }
    });
  })

module.exports = router;
