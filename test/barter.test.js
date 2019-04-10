const libbarter = require("../index.js");

const Barter = new libbarter();

test("getCollection() returns an array of valid CollectionItems", () => {
    return Barter.getCollection("3ede", "b").then(collection => {
        expect(collection.filter(i => i instanceof Barter._CollectionItem).length).toBe(collection.length);
        expect(collection[0].id).toBe(9555);
    });
});

test("getGlobalOfferCollector() returns a GlobalOfferCollector that emits FeedOffers (this may take a moment...)", () => {
    jest.setTimeout(120000);

    let collector = Barter.getGlobalOfferCollector(1000);

    expect(collector instanceof Barter._GlobalOfferCollector).toBe(true);

    return new Promise((resolve, reject) => {
        collector.once("offer", offer => {
            expect(offer instanceof Barter._FeedOffer).toBe(true);
            resolve();
        });
    });
});

test("getItem() returns a valid Item", () => {
    return Barter.getItem(9555).then(item => {
        expect(item instanceof Barter._Item).toBe(true);
        expect(item.title).toBe("Trading Card");
    });
});

test("getOffer() returns a valid Offer", () => {
    return Barter.getOffer(2247076).then(offer => {
        expect(offer instanceof Barter._Offer).toBe(true);
        expect(offer.opened).toBe(false);
        expect(offer.isMultiUser).toBe(false);
        expect(offer.to.id).toBe("3ede");
    });
});

test("getOffers() returns an object of valid LimitedOffers", () => {
    return Barter.getOffers("3ede").then(offers => {
        expect(Object.keys(offers).filter(i => offers[i] instanceof Barter._LimitedOffer).length).toBe(Object.keys(offers).length);
        expect(offers[2247076].isFailed).toBe(false);
    });
});

test("getUser() returns a valid User", () => {
    return Barter.getUser("3ede").then(user => {
        expect(user instanceof Barter._User).toBe(true);
        expect(user.steamid).toBe("76561198852754414");
    });
});

test("getUserBySteamID() returns a valid User", () => {
    return Barter.getUserBySteamID("76561198852754414").then(user => {
        expect(user instanceof Barter._User).toBe(true);
        expect(user.id).toBe("3ede");
    });
});