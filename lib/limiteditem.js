module.exports = class LimitedItem {
  constructor(itemData, libbarter) {
    this._libbarter = libbarter;

    this.id = itemData.item_id;

    this.title = itemData.title;
    this.title_extra = itemData.title_extra;
    this.type = itemData.type;

    // Platform-specific information
    // I don't even know how to handle this
    // It's probably gonna suck. Like, really bad

    this.platform = {};
    this.platform.isSteam = false;
    this.platform.id = itemData.platform;
    this.platform.name = "Unknown";
    this.platform.sku = itemData.sku;

    if (itemData.platform === 1) { // Steam
      this.platform = {};
      this.platform.isSteam = true;

      this.platform.name = "Steam";

      this.platform.appid = itemData.sku;
      this.platform.store = "https://store.steampowered.com/app/" + itemData.sku;

      this.platform.achievements = itemData.achievements;
      this.platform.cards = itemData.cards;
      this.platform.areCardsMarketable = itemData.cards_marketable === 1;
    }
    else { // Who the hell knows. Certainly not me
    }

    this.collections = {};
    this.collections.tradable = itemData.tradable;
    this.collections.wishlists = itemData.wishlist;
    this.collections.library = itemData.library;

    this.isBundled = (itemData.bundles_all + itemData.bundles_available + itemData.bundles_packages) > 0;

    this.bundles = {};
    this.bundles.all = itemData.bundles_all;
    this.bundles.current = itemData.bundles_available;
    this.bundles.packages = itemData.bundles_packages;

    this.isGiftLink = itemData.item_type === "unrevealed";

    // I don't foresee anyone ever using this - because why do you care - but will add it anyway just in case
    this.retail = {};
    this.retail.id = itemData.retail_id;
    this.retail.bundle = {};
    this.retail.bundle.id = itemData.bundle_id;
    this.retail.bundle.name = itemData.bundle_name;

    this.price = {};
    this.price.usd = itemData.price / 100;
    this.price.usdHighest = itemData.price_high / 100;
    this.price.eur = itemData.price_euro / 100;
    this.price.eurHighest = itemData.price_euro_high / 100;

    this.reviews = {};
    this.reviews.rating = itemData.user_reviews_positive;
    this.reviews.total = itemData.user_reviews_total;

    this.url = "https://barter.vg/i/" + this.id;

    this._Symbols = require("./symbols.js");
  }

  toString(withMetadata = true) {
    let ret = this._libbarter._he.decode(this.title);

    if (withMetadata) {
      ret += " (";


      if (this.reviews && this.reviews.rating && this.reviews.rating > -1) {
        ret += this.reviews.rating + "% ";
      }

      ret += this.collections.tradable + this._Symbols.TRADEABLE;
      ret += " " + this.collections.wishlists + this._Symbols.WISHLIST;
      ret += " " + this.collections.library + this._Symbols.LIBRARY;

      if (this.isBundled) {
        ret += " " + (this.bundles.all + this.bundles.packages) + this._Symbols.BUNDLES;
      }

      if (this.platform.cards) {
        ret += " " + this.platform.cards + this._Symbols.CARDS;
      }

      if (this.platform.achievements) {
        ret += " " + this.platform.achievements + this._Symbols.ACHIEVEMENTS;
      }

      ret += ")";

    }

    return ret;
  }

  async getFullItem() {
    return await this._libbarter.getItem(this.id);
  }
}
