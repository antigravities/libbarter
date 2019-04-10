module.exports = class Collection {
  constructor(id, libbarter, type = "t") {
    this._libbarter = libbarter;
    this.id = id;
    this.type = type;
  }

  async init() {
    let res = [];
    let collection = JSON.parse(await this._libbarter._request("https://barter.vg/u/" + this.id + "/" + this.type + "/json"));

    /*
      {
        by_platform: {
          platid: {
            itemid: {
              CollectionItem
            }
          }
        },
        tags: [ TODO ],
        retailer_id: {
          (retailer ID mappings, i.e. Steam, HB)
        }
      }
    */

    // iterate over by_platform
    Object.keys(collection.by_platform).forEach(_ => {
      // iterate over by_platform._ (platid)
      Object.keys(collection.by_platform[_]).forEach(i => {
        // get the item
        let item = collection.by_platform[_][i];
        let tags = [];

        if (collection.tags !== []) { // empty arrays don't matter here
          Object.keys(collection.tags).forEach(i => {
            i = collection.tags[i];
            i = i[Object.keys(i)[0]]; // *wew*
            if (item.line_id === i.line_id) tags.push(i);
          });
        }

        // return a new CollectionItem
        res.push(new this._libbarter._CollectionItem(item, tags, this._libbarter));
      });
    });

    return res;
  }
}
