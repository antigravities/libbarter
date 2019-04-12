const EventEmitter = require("events");

module.exports = class Firehose extends EventEmitter {
    constructor(target, ignore = [], pollTime = 300000, libbarter){
        super();

        this._libbarter = libbarter;
        this._target = target;
        this._cache = ignore;

        this._interval = setInterval(() => this._poll(), pollTime);
        setTimeout(() => this._poll(), 500);
    }

    async _poll(){
        let items = await this._libbarter._doRequest("https://barter.vg/firehose/" + this._target);

        let newCache = Object.keys(items);

        let result = [];

        newCache.forEach(i => {
            if( this._cache.indexOf(i) < 0 ) result.push(new this._libbarter._FirehoseItem(items[i], i, this._libbarter));
        });

        result.forEach(i => {
            this.emit("item", i);
        });

        this.emit("items", newCache);

        this._cache = newCache;
    }

    async destroy(){
        clearInterval(this._interval);
    }
}