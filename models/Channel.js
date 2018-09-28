var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  title: {type:String, required:true},
  link: String,
  description: String,
  language: String,
  //or release_date
  pubDate: {type:Date,default:new Date()},
  author:String,
  summary:String,
  subtitle:String,
  //or big_cover_url or small_cover_url
  image:String,
  cid: String,
  new_cid: String,
  channel_id: String,
  Provider_id: String,
  episode_count: Number,
  play_count: Number,
  sub_count: Number,
  comment_count: Number,
  categories: String,
  keywords: String,
  tags: String,
  rss_url: String,
  valid:Boolean,
  errorsMsg:[{
    code :Number,
    msg:String
}]
});
module.exports = mongoose.model('Channel', channelSchema);
