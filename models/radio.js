var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Items = new Schema({
    play_count: {type: String },
    sub_count: {type: String },
    comment_count: {type: String },
    categorie:{type: String },
    keywords:{type: String },
    tags:{type: String },
    rss_url:{type: String },
    small_cover_url:{type: String },
    big_cover_url:{type: String },
})


var radioSchema = new Schema({

  language:    { type: String},
  title: { type: String },
  description: { type: String },
  provider_id: { type: String},
  author: { type: String},
  release_date: { type: String },
  episode_count: { type: [Items] }
  
});
module.exports = mongoose.model('Items', Items);
module.exports = mongoose.model('radio', radioSchema);