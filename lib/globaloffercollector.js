const EventEmitter = require("events");

module.exports = class GlobalOfferCollector extends EventEmitter {
  constructor(poll, libbarter) {
    super();
    this._libbarter = libbarter;
    this._lastPoll = Math.floor(Date.now() / 1000);

    this.offers = [];

    this._interval = setInterval(() => {
      this._poll();
    }, poll);
  }

  async _poll() {
    let trades = JSON.parse(await this._libbarter._request("https://barter.vg/o/json/" + this._lastPoll));

    Object.keys(trades).forEach(i => {
      let offer = new this._libbarter._FeedOffer(i, trades[i], this._libbarter);
      this.offers.push(offer);
      this.emit("offer", offer);
    });

    this._lastPoll = Math.floor(Date.now() / 1000);
  }

  destroy() {
    clearInterval(this._interval);
  }
}
