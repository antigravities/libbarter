let AbstractOffer = require("./abstractoffer.js");

module.exports = class LimitedOffer extends AbstractOffer {
  constructor(offerID, offerObject, libbarter) {
    super();

    this._libbarter = libbarter;

    this.id = parseInt(offerID, 10);

    this.from = new this._libbarter._LimitedUser(offerObject.from_user_id, offerObject.from_username, this._libbarter, { active: offerObject.from_is_active, role: "from" });
    this.to = new this._libbarter._LimitedUser(offerObject.to_user_id, offerObject.to_username, this._libbarter, { active: offerObject.to_is_active, role: "to" });

    this.created = new Date(offerObject.created * 1000);
    this.expires = new Date(offerObject.expire * 1000);
    this.updated = new Date(offerObject.updated * 1000);

    // was this offer countered?
    this.wasCountered = offerObject.counter_id != 0;
    this.counter = offerObject.counter_id === 0 ? null : offerObject.counter_id;

    // is this offer a counter?
    this.isCounter = offerObject.original != 0;
    this.original = offerObject.original === 0 ? null : offerObject.original;

    this.actor = (
      offerObject.side_to_act === "to" ? this.to :
      offerObject.side_to_Act === "from" ? this.from :
      null
    );

    this.isFailed = false;
    this.isDeclined = false;

    this.declineReason = null;
    this.failureReasons = {
      to: null,
      from: null
    };

    this.url = "https://barter.vg/u/my/" + this.id;

    this._setOfferStatus(offerObject);
  }

  async getFullOffer() {
    return await this._libbarter.getOffer(this.id);
  }

  async getOriginal() {
    if (!this.isCounter) throw "This offer is not a counter of another";
    return await this._libbarter.getOffer(this.original);
  }

  async getCounter() {
    if (!this.wasCountered) throw "This offer was not countered";
    return await this._libbarter.getOffer(this.counter);
  }
  
  toString(){
    return this.status + " offer from " + this.from.toString() + (this.actor === this.from ? "*" : "" ) + " to " + this.to.toString() + (this.actor === this.to ? "*": "");
  }
};
