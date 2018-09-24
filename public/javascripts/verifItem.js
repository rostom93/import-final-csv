var express = require("express");
var mongoose = require("mongoose");
var Item = mongoose.model("Item");
const urlExists = require("url-exists");

var verify = require("./verification");

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

    return errorsMsg;
  } else {
    return null;
  }

  return null;
};

// verification of a Date
module.exports.verifyDate = function(date, callback) {
  if (typeof date === "undefined") {
    errorsMsg = {
      code: "201",
      msg: "pubDate: date does not exsist"
    };
    return errorsMsg;
  } else {
    dateaux = Date.parse(date[0]);

    if (isNaN(dateaux)) {
      errorsMsg = {
        code: "202",
        msg: "pubDate: date format is not correct"
      };
      return errorsMsg;
    }
  }
  return null;
};

//verify is a string is empty
module.exports.isEmpty = function(chaine) {
  if (typeof chaine === "undefined" || chaine[0] === "") {
    return true;
  } else {
    return false;
  }
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

// verify and create the item
module.exports.verifyAndCreateItem = function(it) {
  item = new Item();
  it = verify.removeItunes(it);
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
    item.valid = false;
  } else {
    item.guid = it.guid[0];
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
  } else {
    item.explicit = it.explicit[0];
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
