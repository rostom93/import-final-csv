var express = require("express");
var mongoose = require("mongoose");
var Channel = mongoose.model("Channel");
var Item = mongoose.model("Item");
const urlExists = require("url-exists");

var Channel = mongoose.model("Channel");
// verification of the exsisting of a channel
module.exports.verifyChannel = function(result, callback) {
  if (typeof result["rss"] !== "undefined" && result["rss"]) {
    if (
      typeof result["rss"]["channel"] !== "undefined" &&
      result["rss"]["channel"]
    ) {
      return true;
    }
  }
  return false;
};
//verify is a string is empty
module.exports.isEmpty = function(chaine) {
  if (typeof chaine === "undefined" || chaine[0] === "") {
    return true;
  } else {
    return false;
  }
};
// verification of a Date
module.exports.verifyDate = function(date, callback) {
  if (typeof date === "undefined") {
    errorsMsg = {
      code: "3111",
      msg: "release_date: date does not exsist"
    };
    return errorsMsg;
  } else {
    dateaux = Date.parse(date);

    if (isNaN(dateaux)) {
      errorsMsg = {
        code: "3112",
        msg: "release_date: date format is not correct"
      };
      return errorsMsg;
    }
  }
  return null;
};
// verification of the exsisting of an Item
module.exports.verifyItemExsist = function(channel, callback) {
  if (typeof channel[0].item !== "undefined" && channel[0].item !== null) {
    return true;
  } else {
    return false;
  }
};
// remove itunes if exsists
module.exports.removeItunes = function(it) {
  var keys = Object.keys(it);
  for (var i = 0; i < keys.length; i++) {
    var s = keys[i].split(":");

    if (s.length > 1) {
      var newkey = s[s.length - 1];
      var deletedkey = keys[i];

      Object.defineProperty(
        it,
        newkey,
        Object.getOwnPropertyDescriptor(it, deletedkey)
      );
      delete it[deletedkey];
    }
  }
  return it;
};
// verification of a valid and an audio/video URL
module.exports.verifyUrlcsv = function(url, callback) {
  errorsMsg = null;
  if (url !== "") {
    urlExists(url, function(err, exists) {
      if (!exists) {
        errorsMsg = {
          code: "3120",
          msg: "the rss_url is not valid"
        };
      }
    });
    return errorsMsg;
  } else if (url === "") {
    errorsMsg = {
      code: "3121",
      msg: "the rss_url is empty"
    };

    return errorsMsg;
  } else {
    return null;
  }

  return null;
};

// verification of a valid and an audio/video URL
module.exports.verifyUrl = function(url, callback) {
  errorsMsg = null;
  if (url !== "") {
    var lastFour = url.substr(url.length - 4);
    if (
      lastFour === ".mp3" ||
      lastFour === ".mp4" ||
      lastFour === ".wmv" ||
      lastFour === ".wmv"
    ) {
      urlExists(url, function(err, exists) {
        if (!exists) {
          errorsMsg = {
            code: "214",
            msg: "the URL in this item is not valid"
          };
        }
      });
      return errorsMsg;
    } else {
      errorsMsg = {
        code: "215",
        msg: "the URL in this item does not provide an audio or video"
      };
      return errorsMsg;
    }
  } else if (url === "") {
    errorsMsg = {
      code: "213",
      msg: "the URL in this item is empty"
    };
    console.log(url);
    return errorsMsg;
  } else {
    return null;
  }

  return null;
};
// verifying enclosure
module.exports.verifEnclosure = function(enclosure) {
  if (typeof enclosure === "undefined") {
    errorsMsg = {
      code: "211",
      msg: "enclosure does not exsist"
    };
    return errorsMsg;
  } else if (typeof enclosure[0]["$"]["url"] === "undefined") {
    errorsMsg = {
      code: "212",
      msg: "url does not exsist in enclosure"
    };
    return errorsMsg;
  } else {
    return null;
  }
};
// verify elements of channel and create it
module.exports.verifyAndCreateChannel = function(jsonChannel, callback) {
  channel = new Channel();

  jsonChannel = this.removeItunes(jsonChannel);

  if (this.isEmpty(jsonChannel.cid)) {
    channel.cid = "";
    channel.errorsMsg.push({
      code: "31",
      msg: "the channel does not specify the cid"
    });
  } else {
    channel.cid = jsonChannel.cid;
  }

  if (this.isEmpty(jsonChannel.new_cid)) {
    channel.new_cid = "";
    channel.errorsMsg.push({
      code: "32",
      msg: "the channel does not specify the new_cid"
    });
  } else {
    channel.new_cid = jsonChannel.new_cid;
  }

  if (this.isEmpty(jsonChannel.channel_id)) {
    channel.channel_id = "";
    channel.errorsMsg.push({
      code: "33",
      msg: "the channel does not specify the channel_id"
    });
  } else {
    channel.channel_id = jsonChannel.channel_id;
  }
  if (this.isEmpty(jsonChannel.LANGUAGE)) {
    channel.LANGUAGE = "";
    channel.errorsMsg.push({
      code: "34",
      msg: "the channel does not specify the LANGUAGE"
    });
    channel.valid = false;
  } else {
    channel.language = jsonChannel.language;
  }
  if (this.isEmpty(jsonChannel.title)) {
    channel.title = "";
    channel.errorsMsg.push({
      code: "35",
      msg: "the channel does not specify the title"
    });
    channel.valid = false;
  } else {
    channel.title = jsonChannel.title;
  }
  if (this.isEmpty(jsonChannel.description)) {
    channel.description = "";
    channel.errorsMsg.push({
      code: "36",
      msg: "the channel does not specify the description"
    });
    channel.valid = false;
  } else {
    channel.description = jsonChannel.description;
  }
  if (this.isEmpty(jsonChannel.Provider_id)) {
    channel.Provider_id = "";
    channel.errorsMsg.push({
      code: "37",
      msg: "the channel does not specify the Provider_id"
    });
  } else {
    channel.Provider_id = jsonChannel.Provider_id;
  }
  if (this.isEmpty(jsonChannel.author)) {
    channel.author = "";
    channel.errorsMsg.push({
      code: "38",
      msg: "the channel does not specify the author"
    });
    channel.valid = false;
  } else {
    channel.author = jsonChannel.author;
  }
  if (this.isEmpty(jsonChannel.categories)) {
    channel.categories = "";
    channel.errorsMsg.push({
      code: "39",
      msg: "the channel does not specify the categories"
    });
    channel.valid = false;
  } else {
    channel.categories = jsonChannel.categories;
  }

  if (this.isEmpty(jsonChannel.keywords)) {
    channel.keywords = "";
    channel.errorsMsg.push({
      code: "39",
      msg: "the channel does not specify the keywords"
    });
  } else {
    channel.keywords = jsonChannel.keywords;
  }

  if (this.isEmpty(jsonChannel.tags)) {
    channel.tags = "";
    channel.errorsMsg.push({
      code: "310",
      msg: "the channel does not specify the tags"
    });
  } else {
    channel.tags = jsonChannel.tags;
  }
  verifdate = this.verifyDate(jsonChannel.release_date);
  if (verifdate === null) {
    channel.release_date = jsonChannel.release_date;
  } else {
    channel.errorsMsg.push(verifdate);
    channel.valid = false;
    channel.release_date = new Date();
  }

  const verifurl = this.verifyUrlcsv(jsonChannel.rss_url);
  if (verifurl !== null) {
    channel.errorsMsg.push(verifurl);
    channel.valid = false;
  }
  channel.rss_url = jsonChannel.rss_url;

  if (this.isEmpty(jsonChannel.small_cover_url)) {
    channel.small_cover_url = "";
    channel.errorsMsg.push({
      code: "313",
      msg: "the channel does not specify the small_cover_url"
    });
  } else {
    channel.small_cover_url = jsonChannel.small_cover_url;
  }
  if (this.isEmpty(jsonChannel.big_cover_url)) {
    channel.big_cover_url = "";
    channel.errorsMsg.push({
      code: "314",
      msg: "the channel does not specify the big_cover_url"
    });
  } else {
    channel.big_cover_url = jsonChannel.big_cover_url;
  }
  if (this.isEmpty(jsonChannel.episode_count)) {
    channel.episode_count = "";
    channel.errorsMsg.push({
      code: "3144",
      msg: "the channel does not specify the episode_count"
    });
  } else {
    channel.episode_count = jsonChannel.episode_count;
  }
  if (this.isEmpty(jsonChannel.play_count)) {
    channel.play_count = "";
    channel.errorsMsg.push({
      code: "3145",
      msg: "the channel does not specify the play_count"
    });
  } else {
    channel.play_count = jsonChannel.play_count;
  }

  if (this.isEmpty(jsonChannel.sub_count)) {
    channel.sub_count = "";
    channel.errorsMsg.push({
      code: "3146",
      msg: "the channel does not specify the sub_count"
    });
  } else {
    channel.sub_count = jsonChannel.sub_count;
  }
  if (this.isEmpty(jsonChannel.comment_count)) {
    channel.comment_count = "";
    channel.errorsMsg.push({
      code: "3146",
      msg: "the channel does not specify the comment_count"
    });
  } else {
    channel.comment_count = jsonChannel.comment_count;
  }

  return channel;
};

// verify elements of channel and create it
module.exports.verifyAndCreateChannelxml = function(ch, callback) {
  channel = new Channel();
  
  ch[0]=this.removeItunes(ch[0]);
  
  if (this.isEmpty(ch[0].title)) {
    channel.title = "";
    channel.errorsMsg.push({
      code: "11",
      msg: "the channel does not have a title"
    });
    channel.valid = false;
  } else {
    channel.title = ch[0].title;
  }
  // you did not put verification on the link
  if (this.isEmpty(ch[0].link)) {
    channel.link = "";
    channel.errorsMsg.push({
      code: "12",
      msg: "the channel does not have a link"
    });
    channel.valid = false;
  } else {
    channel.link = ch[0].link;
  }
  if (this.isEmpty(ch[0].description)) {
    channel.description = "";
    channel.errorsMsg.push({
      code: "13",
      msg: "the channel does not have a description"
    });
    channel.valid = false;
  } else {
    channel.description = ch[0].description;
  }
  if (this.isEmpty(ch[0].language)) {
    channel.language = "";
    channel.errorsMsg.push({
      code: "14",
      msg: "the channel does not specify the language"
    });
    channel.valid = false;
  } else {
    channel.language = ch[0].language;
  }
  if (this.isEmpty(ch[0].author)) {
    channel.author = "";
    channel.errorsMsg.push({
      code: "15",
      msg: "the channel does not specify the author"
    });
    channel.valid = false;
  } else {
    channel.author = ch[0].author;
  }
  if (this.isEmpty(ch[0].summary)) {
    channel.summary = "";
    channel.errorsMsg.push({
      code: "16",
      msg: "the channel does not specify the summary"
    });
    channel.valid = false;
  } else {
    channel.summary = ch[0].summary;
  }
  if (this.isEmpty(ch[0].subtitle)) {
    channel.subtitle = "";
    channel.errorsMsg.push({
      code: "17",
      msg: "the channel does not specify the subtitle"
    });
  } else {
    channel.subtitle = ch[0].subtitle;
  }
  if (this.isEmpty(ch[0].image)) {
    channel.image = "";
    channel.errorsMsg.push({
      code: "18",
      msg: "the channel does not have an image"
    });
    channel.valid = false;
  } else {
    channel.image = ch[0].image[0]["$"]["href"];
  }

  return channel;
};
// verify and create the item
module.exports.verifyAndCreateItem = function(it) {
  item = new Item();

  it = this.removeItunes(it);

  if (this.isEmpty(it.title)) {
    item.title = "";
    item.errorsMsg.push({
      code: "20",
      msg: "the item does not have a title"
    });
    item.valid = false;
  } else {
    item.title = it.title[0];
  }
  if (this.isEmpty(it.link)) {
    item.link = "";
    item.errorsMsg.push({
      code: "21",
      msg: "the item does not have a link"
    });
    item.valid = false;
  } else {
    item.link = it.link[0];
  }
  if (this.isEmpty(it.description)) {
    item.description = "";
    item.errorsMsg.push({
      code: "22",
      msg: "the item does not have a description"
    });
    item.valid = false;
  } else {
    item.description = it.description[0];
  }
  if (this.isEmpty(it.author)) {
    item.author = "";
    item.errorsMsg.push({
      code: "23",
      msg: "the item does not have an author"
    });
    item.valid = false;
  } else {
    item.author = it.author[0];
  }
  if (this.isEmpty(it.guid)) {
    item.guid = "";
    item.errorsMsg.push({
      code: "24",
      msg: "the item does not have a guid"
    });
  } else {
    item.guid = it.guid[0];
  }
  if (this.isEmpty(it.summary)) {
    item.summary = "";
    item.errorsMsg.push({
      code: "25",
      msg: "the item does not have a summary"
    });
    item.valid = false;
  } else {
    item.summary = it.summary[0];
  }
  if (this.isEmpty(it.keywords)) {
    item.keywords = "";
    item.errorsMsg.push({
      code: "26",
      msg: "the item does not have keywords"
    });
  } else {
    item.keywords = it.keywords[0];
  }
  if (this.isEmpty(it.explicit)) {
    item.explicit = "";
    item.errorsMsg.push({
      code: "27",
      msg: "the item does not specify explicit"
    });
    item.valid = false;
  } else {
    item.explicit = it.explicit[0];
  }
  if (this.isEmpty(it.category)) {
    item.category = "";
    item.errorsMsg.push({
      code: "2440",
      msg: "the item does not have a category"
    });
    item.valid = false;
  } else {
    item.category = it.category[0];
  }
  if (this.isEmpty(it.subtitle)) {
    item.subtitle = "";
    item.errorsMsg.push({
      code: "277",
      msg: "the item does not specify subtitle"
    });
  } else {
    item.subtitle = it.subtitle[0];
  }
  if (this.isEmpty(it.image)) {
    item.image = "";
    item.errorsMsg.push({
      code: "28",
      msg: "the item does not have an image"
    });
    item.valid = false;
  } else {
    item.image = it.image[0]["$"]["href"];
  }
  if (this.isEmpty(it.duration)) {
    item.duration = "";
    item.errorsMsg.push({
      code: "29",
      msg: "the item does not specify the duration"
    });
    item.valid = false;
  } else {
    item.duration = it.duration[0];
  }
  verifdate = this.verifyDate(it.pubDate);
  if (verifdate === null) {
    item.pubDate = it.pubDate[0];
  } else {
    item.errorsMsg.push(verifdate);
    item.valid = false;
    item.pubDate = new Date();
  }
  verifenclosure = this.verifEnclosure(it.enclosure);
  if (verifenclosure !== null) {
    item.errorsMsg.push(verifenclosure);
    item.valid = false;
    item.enclosure = null;
  } else {
    const verifurl = this.verifyUrl(it.enclosure[0]["$"]["url"]);
    if (verifurl !== null) {
      item.errorsMsg.push(verifurl);
      item.valid = false;
    }
    item.enclosure.url = it.enclosure[0]["$"]["url"];
    item.enclosure.length = it.enclosure[0]["$"]["length"];
    item.enclosure.type = it.enclosure[0]["$"]["type"];
  }

  // returning the item
  return item;
};