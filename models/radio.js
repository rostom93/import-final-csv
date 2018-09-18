var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var radioSchema = new Schema({
  cid: String,
  new_cid: String,
  channel_id: String,
  LANGUAGE: String,
  title:String,
  description: String,
  Provider_id: String,
  author: String,
  release_date: {type:Date,required:true,default:new Date()},
  episode_count: Number,
  play_count: Number,
  sub_count:Number,
  comment_count: Number,
  categories: String,
  keywords: String,
  tags: String,
  rss_url:{
    type:String ,required:true
  },
  small_cover_url:String,
  big_cover_url: String,
  valid:[{
    msg:String
  }],
  status:{type:Boolean, default:true}
  
});
module.exports = mongoose.model('Radio', radioSchema);