module.exports = class Offers {
  constructor(user, libbarter) {
    this.user = user;
    this._libbarter = libbarter;

    this.request = require("request-promise");

    this.url = "https://barter.vg/u/" + this.user + "/o/";
  }

  async init() {
    let response = await this._libbarter._doRequest("https://barter.vg/u/" + this.user + "/o/json");

    let offers = {};

    Object.keys(response).forEach(i => {
      if (i === "0") {
        this.count = response[i].count;
      }
      else {
        offers[i] = new this._libbarter._LimitedOffer(i, response[i], this._libbarter);
      }
    });

    return offers;
  }
}
