var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const radio = require("./Radio");
const channel = require("./Channel");

require("mongoose-type-url");

var itemSchema = new Schema({
  title: String,
  link: String,
  category: String,
  pubDate: { type: Date, default: new Date(), required: true },
  description: String,
  enclosure: {
    url: { type: mongoose.SchemaTypes.Url },
    length: { type: Number },
    type: { type: String }
  },
  author: String,
  subtitle:String,
  guid: String,
  channel: { type: Schema.Types.ObjectId, ref: "Channel" },
  summary: String,
  keywords: String,
  duration: String,
  explicit: String,
  image: String,
  valid: { type: Boolean, default: true, required: true },
  errorsMsg: [
    {
      code: Number,
      msg: String
    }
  ]
});

module.exports = mongoose.model("Item", itemSchema);
