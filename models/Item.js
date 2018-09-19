var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
 
      title: String,
      link: String,
      category: String,
      pubDate: {type:Date,default:new Date(), required:true},
      description: String,
      enclosure:  {
            url: { type: String },
            length: {type: Number},
            type:{type: String}
          },
      author: String,
      guid: String,
      radio : { type: Schema.Types.ObjectId, ref: 'Radio' },
      subtitle:String,
      summary:String,
      keywords:String,
      duration:String,
      explicit:String,
      image:String,
      valid:[{
            isValid:{type:Boolean,default:true},
            code :Number,
            msg:String
      }]
    
});

module.exports = mongoose.model('Item', itemSchema);