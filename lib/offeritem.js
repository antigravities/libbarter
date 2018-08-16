let LimitedItem = require("./limiteditem.js");

module.exports = class OfferItem extends LimitedItem {
  constructor(itemData, libbarter) {
    super(itemData, libbarter);

    this.quantity = itemData.quantity;
  }
}
