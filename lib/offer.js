let AbstractOffer = require("./abstractoffer.js");

module.exports = class Offer extends AbstractOffer {
  constructor(id, libbarter, as = "a0") {
    super();
    this.id = id;
    this.as = as;
    this._libbarter = libbarter;
  }

  async init() {
    let offerObject = await this._libbarter._doRequest("https://barter.vg/u/" + this.as + "/o/" + this.id + "/json");

    this.from = new this._libbarter._LimitedUser(offerObject.from_user_id, offerObject.from_username, this._libbarter, { steamid: offerObject.from_steam_id, role: "from" });

    if (offerObject.to_user_id !== "ffffffffffffffff") {
      this.to = new this._libbarter._LimitedUser(offerObject.to_user_id, offerObject.to_username, this._libbarter, { steamid: offerObject.to_steam_id, role: "from" });
    }
    else {
      this.to = new this._libbarter._LimitedUser("0", "(multi-user offer)", this._libbarter, { steamid: "76561197960287930", role: "to" });
    }

    this.isMultiUser = offerObject.type_id === 2;

    this.created = new Date(offerObject.created * 1000);
    this.updated = new Date(offerObject.updated * 1000);

    this.opened = offerObject.opened === 1;

    this.items = {};

    this.items.from = Object.keys(offerObject.items.from).map(i => new this._libbarter._OfferItem(offerObject.items.from[i], this._libbarter));
    this.items.to = Object.keys(offerObject.items.to).map(i => new this._libbarter._OfferItem(offerObject.items.to[i], this._libbarter));

    this.items.fromSelect = offerObject.from_and_or ? offerObject.from_and_or : this.items.from.length;
    this.items.toSelect = offerObject.to_and_or ? offerObject.to_and_or : this.items.to.length;

    this.isAutomated = offerObject.app_id !== null;

    this.url = "https://barter.vg/u/my/o/" + this.id;

    this._setOfferStatus(offerObject);

    return this;
  }

  toString(showMetadata = true, showTo = true) {
    return this.status + " offer from " + this.from.toString() + ": " + this.items.fromSelect + " of their " + this.items.from.map(i => i.toString(showMetadata)).join("; ") + " for " + this.items.toSelect + " of " + (showTo ? this.to.toString() + "'s" : "your") + " " + this.items.to.map(i => i.toString(showMetadata)).join("; ");
  }
}
