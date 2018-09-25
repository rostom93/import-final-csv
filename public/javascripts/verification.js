var express = require("express");
var mongoose = require("mongoose");
var Radio = mongoose.model("Radio");
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
// verify elements of radio and create it
module.exports.verifyAndCreateRadio = function(jsonRadio, callback) {
  radio = new Radio();

  jsonRadio = this.removeItunes(jsonRadio);

  if (this.isEmpty(jsonRadio.cid)) {
    radio.cid = "";
    radio.errorsMsg.push({
      code: "31",
      msg: "the radio does not specify the cid"
    });
  } else {
    radio.cid = jsonRadio.cid;
  }

  if (this.isEmpty(jsonRadio.new_cid)) {
    radio.new_cid = "";
    radio.errorsMsg.push({
      code: "32",
      msg: "the radio does not specify the new_cid"
    });
  } else {
    radio.new_cid = jsonRadio.new_cid;
  }

  if (this.isEmpty(jsonRadio.channel_id)) {
    radio.channel_id = "";
    radio.errorsMsg.push({
      code: "33",
      msg: "the radio does not specify the channel_id"
    });
  } else {
    radio.channel_id = jsonRadio.channel_id;
  }
  if (this.isEmpty(jsonRadio.LANGUAGE)) {
    radio.LANGUAGE = "";
    radio.errorsMsg.push({
      code: "34",
      msg: "the radio does not specify the LANGUAGE"
    });
    radio.valid = false;
  } else {
    radio.LANGUAGE = jsonRadio.LANGUAGE;
  }
  if (this.isEmpty(jsonRadio.title)) {
    radio.title = "";
    radio.errorsMsg.push({
      code: "35",
      msg: "the radio does not specify the title"
    });
    radio.valid = false;
  } else {
    radio.title = jsonRadio.title;
  }
  if (this.isEmpty(jsonRadio.description)) {
    radio.description = "";
    radio.errorsMsg.push({
      code: "36",
      msg: "the radio does not specify the description"
    });
    radio.valid = false;
  } else {
    radio.description = jsonRadio.description;
  }
  if (this.isEmpty(jsonRadio.Provider_id)) {
    radio.Provider_id = "";
    radio.errorsMsg.push({
      code: "37",
      msg: "the radio does not specify the Provider_id"
    });
  } else {
    radio.Provider_id = jsonRadio.Provider_id;
  }
  if (this.isEmpty(jsonRadio.author)) {
    radio.author = "";
    radio.errorsMsg.push({
      code: "38",
      msg: "the radio does not specify the author"
    });
    radio.valid = false;
  } else {
    radio.author = jsonRadio.author;
  }
  if (this.isEmpty(jsonRadio.categories)) {
    radio.categories = "";
    radio.errorsMsg.push({
      code: "39",
      msg: "the radio does not specify the categories"
    });
    radio.valid = false;
  } else {
    radio.categories = jsonRadio.categories;
  }

  if (this.isEmpty(jsonRadio.keywords)) {
    radio.keywords = "";
    radio.errorsMsg.push({
      code: "39",
      msg: "the radio does not specify the keywords"
    });
  } else {
    radio.keywords = jsonRadio.keywords;
  }

  if (this.isEmpty(jsonRadio.tags)) {
    radio.tags = "";
    radio.errorsMsg.push({
      code: "310",
      msg: "the radio does not specify the tags"
    });
  } else {
    radio.tags = jsonRadio.tags;
  }
  verifdate = this.verifyDate(jsonRadio.release_date);
  if (verifdate === null) {
    radio.release_date = jsonRadio.release_date;
  } else {
    radio.errorsMsg.push(verifdate);
    radio.valid = false;
    radio.release_date = new Date();
  }

  const verifurl = this.verifyUrlcsv(jsonRadio.rss_url);
  if (verifurl !== null) {
    radio.errorsMsg.push(verifurl);
    radio.valid = false;
  }
  radio.rss_url = jsonRadio.rss_url;

  if (this.isEmpty(jsonRadio.small_cover_url)) {
    radio.small_cover_url = "";
    radio.errorsMsg.push({
      code: "313",
      msg: "the radio does not specify the small_cover_url"
    });
  } else {
    radio.small_cover_url = jsonRadio.small_cover_url;
  }
  if (this.isEmpty(jsonRadio.big_cover_url)) {
    radio.big_cover_url = "";
    radio.errorsMsg.push({
      code: "314",
      msg: "the radio does not specify the big_cover_url"
    });
  } else {
    radio.big_cover_url = jsonRadio.big_cover_url;
  }
  if (this.isEmpty(jsonRadio.episode_count)) {
    radio.episode_count = "";
    radio.errorsMsg.push({
      code: "3144",
      msg: "the radio does not specify the episode_count"
    });
  } else {
    radio.episode_count = jsonRadio.episode_count;
  }
  if (this.isEmpty(jsonRadio.play_count)) {
    radio.play_count = "";
    radio.errorsMsg.push({
      code: "3145",
      msg: "the radio does not specify the play_count"
    });
  } else {
    radio.play_count = jsonRadio.play_count;
  }

  if (this.isEmpty(jsonRadio.sub_count)) {
    radio.sub_count = "";
    radio.errorsMsg.push({
      code: "3146",
      msg: "the radio does not specify the sub_count"
    });
  } else {
    radio.sub_count = jsonRadio.sub_count;
  }
  if (this.isEmpty(jsonRadio.comment_count)) {
    radio.comment_count = "";
    radio.errorsMsg.push({
      code: "3146",
      msg: "the radio does not specify the comment_count"
    });
  } else {
    radio.comment_count = jsonRadio.comment_count;
  }

  return radio;
};

// verify elements of channel and create it
module.exports.verifyAndCreateChannel = function(ch, callback) {
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