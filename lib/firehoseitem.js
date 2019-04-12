module.exports = class FirehoseItem {
    constructor(firehoseItem, lineItemID, libbarter){
        this.user = new libbarter._LimitedUser(firehoseItem.user_id, firehoseItem.steam_persona, libbarter);
        this.title = firehoseItem.title;
        this.id = firehoseItem.item_id;
        this.lineItem = lineItemID;

        this._libbarter = libbarter;
    }

    async getFullItem(){
        await this._libbarter.getItem(this.id, this._libbarter);
    }
}