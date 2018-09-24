var express = require("express");
var mongoose = require("mongoose");
var Radio = mongoose.model("Radio");
var Item = mongoose.model("Item");
const urlExists = require("url-exists");

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
module.exports.verifyUrl = function(url, callback) {
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

  const verifurl = this.verifyUrl(jsonRadio.rss_url);
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
