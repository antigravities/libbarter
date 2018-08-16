module.exports = class Collection {
  constructor(id, libbarter, type = "t") {
    this._libbarter = libbarter;
    this.id = id;
    this.type = type;
  }

  async init() {
    let res = [];
    let collection = JSON.parse(await this._libbarter._request("https://barter.vg/u/" + this.id + "/" + this.type + "/json"));

    Object.keys(collection.by_platform).forEach(_ => {
      Object.keys(collection.by_platform[_]).forEach(i => {
        let item = collection.by_platform[_][i];
        let tags = [];

        if (collection.tags !== []) {
          Object.keys(collection.tags).forEach(i => {
            i = collection.tags[i];
            i = i[Object.keys(i)[0]]; // *wew*
            if (item.line_id === i.line_id) tags.push(i);
          });
        }

        res.push(new this._libbarter._CollectionItem(item, tags, this._libbarter));
      });
    });

    return res;
  }
}
