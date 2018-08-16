module.exports = class CollectionItem {
  constructor(itemObject, tags = [], libbarter) {
    this._libbarter = libbarter;

    this.id = itemObject.item_id;
    this.sku = itemObject.sku;
    this.title = itemObject.title;
    this.type = itemObject.item_type;

    this.collections = {};
    this.collections.tradable = itemObject.tradable;
    this.collections.wishlist = itemObject.wishlist;
    this.collections.library = itemObject.library;

    this.tags = [];
    tags.forEach(i => {
      let tag = {};
      tag.id = i.tag_id;
      tag.name = i.name;
      tag.description = i.description;
      this.tags.push(tag);
    });

    this.bundles = itemObject.bundles_all;
  }

  async getFullItem() {
    return await this._libbarter.getItem(this.id);
  }
}
