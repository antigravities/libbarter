module.exports = class Item {
  constructor(id, libbarter) {
    this.id = id;
    this._libbarter = libbarter;
  }

  async init() {
    let itemData = JSON.parse(await this._libbarter._request("https://barter.vg/i/" + this.id + "/json"));

    if (itemData.redirect) {
      return await this._libbarter.getItem(itemData.redirect);
    }

    this.platform = {};
    this.platform.id = itemData.source_id;
    this.platform.name = itemData.source_name;
    this.platform.isSteam = this.platform.id === 1;
    this.platform.store = itemData.source_profile.replace("<SKU>", itemData.sku);
    if (this.platform.isSteam) this.platform.appid = itemData.sku;

    this.title = itemData.title;
    this.title_extra = itemData.title_extra;

    this.titles = {};
    this.titles.title = this.title;
    this.titles.alt = itemData.title_alt;
    this.titles.formatted = itemData.title_formatted;
    this.titles.extra = this.title_extra;

    this.bundles = {};
    this.bundles.available = itemData.bundles_available;
    this.bundles.packages = itemData.bundles_packages;
    this.bundles.rebundled = itemData.bundles_rebundled; // not very useful info. oh well
    this.bundles.all = itemData.bundles_all;

    this.given_away = itemData.giveaway_count > 0;
    this.giveaway_count = itemData.giveaway_count;

    this.cv = itemData.price * (itemData.steamgifts_cv / 100);

    this.collections = {};
    this.collections.tradable = itemData.tradable;
    this.collections.wishlist = itemData.wishlist;
    this.collections.library = itemData.library;
    this.collections.blacklist = itemData.blacklist;
    this.collections.revoked = itemData.revoked;

    this.updated = new Date(itemData.updated * 1000);
    this.released = new Date(itemData.release_date * 1000);

    this.price = {};

    this.price.usd = {};
    this.price.usd.price = itemData.price / 100;
    this.price.usd.highest = itemData.price_high / 100;
    this.price.usd.lowest = itemData.price_low / 100;

    this.price.eur = {};
    this.price.eur.price = itemData.price_euro / 100;
    this.price.eur.highest = itemData.price_euro_high / 100;
    this.price.eur.lowest = itemData.price_euro_low / 100;

    this.price.rmb = {};
    this.price.rmb.price = itemData.price_yuan;
    this.price.rmb.highest = itemData.price_yuan_high;
    this.price.rmb.lowest = itemData.price_yuan_low;

    this.price.updated = new Date(itemData.price_updated * 1000);

    this.owners = itemData.owners; // ?????
    this.players = itemData.players; // ?????

    this.reviews = {};
    this.reviews.rating = itemData.user_reviews_positive;
    this.reviews.total = itemData.user_reviews_all;

    this.os = {};
    this.os.windows = itemData.win === 1;
    this.os.mac = itemData.mac === 1;
    this.os.linux = itemData.linux === 1;

    if (this.platform.isSteam) {
      this.platform.achievements = itemData.achievements;
      this.platform.cards = itemData.cards;
      this.platform.cards_marketable = itemData.cards_marketable === 1;

      this.platform.trailer = {};
      this.platform.trailer.base = "https://steamcdn-a.akamaihd.net/steam/apps/" + itemData.trailer + "/movie480"
      this.platform.trailer.webm = this.platform.trailer.base + ".webm";
      this.platform.trailer.mp4 = this.platform.trailer.base + ".mp4";

      this.platform.tags = Object.keys(itemData.genres).map(i => this._libbarter._he.decode(itemData.genres[i].name));
    }

    this.type = itemData.item_type;

    return this;
  }
}
