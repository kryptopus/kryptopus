const SellAtLimitPrice = require("./SellAtLimitPrice");

module.exports = class SellAtLimitPriceFactory {
  build() {
    return new SellAtLimitPrice();
  }
};
