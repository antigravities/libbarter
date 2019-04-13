const EventEmitter = require("events");

module.exports = class GlobalOfferCollector extends EventEmitter {
  constructor(poll = 30000, cache = [], libbarter) {
    super();
    this._libbarter = libbarter;
    this._lastPoll = Math.floor(Date.now() / 1000);
    this._cache = [];

    this._interval = setInterval(() => {
      this._poll();
    }, poll);
  }

  async _poll() {
    let trades = await this._libbarter._doRequest("https://barter.vg/o/json/" + this._lastPoll);

    Object.keys(trades).forEach(i => {
      if( this._cache.indexOf(i) > -1 ) return;
      this.emit("offer", new this._libbarter._FeedOffer(i, trades[i], this._libbarter));
    });

    this._cache = Object.keys(trades);

    this.emit("offers", this._cache);

    this._lastPoll = Math.floor(Date.now() / 1000);
  }

  destroy() {
    clearInterval(this._interval);
  }
}
