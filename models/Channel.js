var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  title: {type:String, required:true},
  link: String,
  description: String,
  language: String,
  pubDate: {type:Date,default:new Date()},
  author:String,
  summary:String,
  subtitle:String,
  image:String,
  cid: String,
  new_cid: String,
  channel_id: String,
  Provider_id: String,
  release_date: { type: Date, required: true, default: new Date() },
  episode_count: Number,
  play_count: Number,
  sub_count: Number,
  comment_count: Number,
  categories: String,
  keywords: String,
  tags: String,
  rss_url: {
    type: String,
    required: true
  },
  small_cover_url: String,
  big_cover_url: String,
  valid:Boolean,
  errorsMsg:[{
    code :Number,
    msg:String
}]
});
module.exports = mongoose.model('Channel', channelSchema);
