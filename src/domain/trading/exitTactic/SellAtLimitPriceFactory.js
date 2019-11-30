const SellAtLimitPrice = require("./SellAtLimitPrice");

module.exports = class SellAtLimitPriceFactory {
  build(exchangeName, baseSymbol, quoteSymbol, quoteQuantity, price) {
    return new SellAtLimitPrice(exchangeName, baseSymbol, quoteSymbol, quoteQuantity, price);
  }
};
