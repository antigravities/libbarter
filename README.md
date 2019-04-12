# libbarter

API wrapper for Barter.vg

![](https://nodei.co/npm/libbarter.png)

[![Build Status](https://travis-ci.org/antigravities/libbarter.svg?branch=master)](https://travis-ci.org/antigravities/libbarter) [![codecov](https://codecov.io/gh/antigravities/libbarter/branch/master/graph/badge.svg)](https://codecov.io/gh/antigravities/libbarter)

# [Documentation](https://github.com/antigravities/libbarter/wiki)

# Example

```
const Barter = require("./index.js");

(async () => {
  let barter = new Barter();

  let offers = await barter.getOffers("a0");
  let firstOffer = await offers[Object.keys(offers)[0]].getFullOffer();
  let firstItem = firstOffer.items.to[0];
  let firstFullItem = await firstItem.getFullItem();
  
  console.log(firstFullItem);
})();
```

# Tests

libbarter comes with a test suite powered by [jest](https://jestjs.io) that evaluates many features.

```
git clone https://github.com/antigravities/libbarter
cd libbarter
npm i --dev
npm test
```

Grab a cup of tea, tests may take up to 2 minutes to complete as `GlobalOfferCollector` is covered.

# License

[LGPL v3](https://www.gnu.org/licenses/lgpl-3.0.en.html)
