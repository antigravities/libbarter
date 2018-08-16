module.exports = class FeedOffer {
  constructor(id, offer, libbarter) {
    this._libbarter = libbarter;
    this.id = id;

    this.from = new this._libbarter._LimitedUser(offer.from_user_hex, offer.from_steam_persona, this._libbarter, { role: "from" });
    this.to = new this._libbarter._LimitedUser(offer.to_user_hex, offer.to_steam_persona, this._libbarter, { role: "to" });

    this.items = {};

    this.items.from = Object.keys(offer.games.from).map(i => offer.games.from[i]);
    this.items.fromSelect = offer.from_and_or === "all" ? this.items.from.length : offer.from_and_or;

    this.items.to = Object.keys(offer.games.to).map(i => offer.games.to[i]);
    this.items.toSelect = offer.to_and_or === "all" ? this.items.to.length : offer.to_and_or;

    this.expires = new Date(offer.expires * 1000);
    this.updated = new Date(offer.updated * 1000);

    this.status = offer.to_status;
  }

  async getFullOffer() {
    return await this._libbarter.getOffer(this.id);
  }
}
