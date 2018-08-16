module.exports = class User {
  constructor(id, libbarter) {
    this._libbarter = libbarter;
    this.id = id;
  }

  async init() {
    let user = JSON.parse(await this._libbarter._request("https://barter.vg/u/" + this.id + "/json"));

    this.steamid = user.steam_id_string;
    this.avatar = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/" + user.steam_img + "_full.jpg";
    this.available = user.preferences.available === 1;
    this.unavailable = user.preferences.available === -1;

    this.wants = {};
    this.wants.tradeable = user.preferences.want_tradable === 1;
    this.wants.library = user.preferences.want_library === 1;
    this.wants.without_cards = user.preferences.want_cards !== 1;
    this.wants.givenaway = user.preferences.want_givenaway === 1 && user.preferences.avoid_givenaway === -1;
    this.wants.currently_bundled = user.preferences.want_bundles === 1 && user.preferences.avoid_bundles === 1;
    this.wants.above_rating = user.preferences.want_rating;

    this.item_limit = user.preferences.offer_limit;
    this.auto_update = user.preferences.auto_update_lists;

    this.enhancedbarter = user.enhancedbarter; // ?????
    this.sasara = user.sasara === 1; // ?????

    return this;
  }
  
  toString(){
    return this.id + " (" + this.steamid + ")";
  }
}
