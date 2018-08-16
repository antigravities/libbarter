# libbarter

API wrapper for Barter.vg

# STILL VERY WIP - API IS NOT STABLE - DO NOT USE IN PRODUCTION

"You suck" comments belong [here](https://github.com/antigravities/libbarter/issues).

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

# License

[LGPL v3](https://www.gnu.org/licenses/lgpl-3.0.en.html)