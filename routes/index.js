var express = require('express');

var csv = require("fast-csv");

var router = express.Router();

var fs = require('fs');

var mongoose = require('mongoose');

var radio  = mongoose.model('radio');

var csvfile = __dirname + "/../public/files/Classeur.csv";

var stream = fs.createReadStream(csvfile);

var csvtojsonV2=require("csvtojson");
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Import CSV file using NodeJS' });

}).get('/import', function(req, res, next) {

  var  radio  = []
  /*var csvConf={
    header:true,
    escape:';',
    quote:";"
  }
 csv
    .fromStream(stream, csvConf)
      .on("data", function(data){
        console.log(data[0]);
      })
        .on("end", function(){
        });*/

  /*var csvStream = csv()
      .on("data", function(data){
       console.log
       var item = new radio({
        language: data[0] ,
        title: data[1],
        description: data[2],
        provider_id: data[3],
        author:data[4] 
       });
       
        item.save(function(error){
          console.log(item);
            if(error){
                 throw error;
            }
        }); 

  }).on("end", function(){

  });*/

 // stream.pipe(csvStream);
 csvtojsonV2({
  delimiter:';'
})
.fromFile(csvfile)
.then((jsonObj)=>{
    console.log(jsonObj);
  res.json({success : "Data imported successfully.", status : 200});
})
   
}).get('/fetchdata', function(req, res, next) {
  
  radio.find({}, function(err, docs) {
      if (!err){ 
          res.json({success : "Updated Successfully", status : 200, data: docs});
      } else { 
          throw err;
      }
  });

});
module.exports = router;