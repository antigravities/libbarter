module.exports = class Barter {
  constructor(cacheTime = 300, myCookie = null) {
    this.cacheTime = cacheTime;
    this.myCookie = myCookie;

    this._cached = {};

    this._request = require("request-promise");

    this._request.defaults({
      "headers": {
        "User-Agent": "libbarter/0.1.0 (via request) - https://github.com/antigravities/libbarter",
        "Cookie": myCookie != null ? "login=" + myCookie : ""
      }
    });

    this._he = require("he");

    this._Offers = require("./lib/offers.js");
    this._LimitedOffer = require("./lib/limitedoffer.js");
    this._Offer = require("./lib/offer.js");
    this._LimitedItem = require("./lib/limiteditem.js");
    this._OfferItem = require("./lib/offeritem.js");
    this._LimitedUser = require("./lib/limiteduser.js");
    this._User = require("./lib/user.js");
    this._Collection = require("./lib/collection.js");
    this._CollectionItem = require("./lib/collectionitem.js");
    this._Item = require("./lib/item.js");

    this._Symbols = require("./lib/symbols.js");
  }

  async _doRequest(address) {
    try {
      let response = await this._request(address);
      return JSON.parse(response);
    }
    catch (e) {
      throw e;
    }
  }

  _isValidHexID(hexid) {
    if (hexid === null) return false;
    let res = parseInt(hexid, 16);

    if (isNaN(res)) return null;
    else return res;
  }

  _parseAnonymous(user = null, item) {
    if ((!this._isValidHexID(user) || !user) && !this.myCookie) throw new Error("Cannot get your " + item + " without a valid cookie. To use anonymously, pass a valid hex ID");

    if (user === null || !this._isValidHexID(user)) user = "my";

    return user;
  }

  async _getOrCache(identifier, callback) {
    if (this._cached[identifier]) {
      let item = this._cached[identifier];
      if ((item.created + this.cacheTime) < Date.now()) return item.item;
    }

    let result = await callback();

    this._cached[identifier] = {};
    this._cached[identifier].created = Date.now();
    this._cached[identifier].item = result;

    return result;
  }

  async getUser(user = null) {
    user = this._parseAnonymous(user, "user profile");
    return await this._getOrCache("user/" + user, async() => await (new this._User(user, this)).init());
  }

  async getOffers(user = null) {
    user = this._parseAnonymous(user, "offers");
    return await this._getOrCache("offers/" + user, async() => await (new this._Offers(user, this)).init());
  }

  async getOffer(offer) {
    return await this._getOrCache("offer/" + offer, async() => await (new this._Offer(offer, this)).init());
  }

  async getCollection(user = null, type = "t") {
    user = this._parseAnonymous(user, type + " collection");
    return await this._getOrCache("collection/" + user + "/" + type, async() => await (new this._Collection(user, this, type)).init());
  }

  async getItem(item) {
    return await this._getOrCache("item/" + item, async() => await (new this._Item(item, this)).init());
  }
}
