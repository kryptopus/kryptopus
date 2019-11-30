const BuyAtLimitPrice = require("./BuyAtLimitPrice");

module.exports = class BuyAtLimitPriceFactory {
  build(exchangeName, baseSymbol, quoteSymbol, baseQuantity, price) {
    return new BuyAtLimitPrice(exchangeName, baseSymbol, quoteSymbol, baseQuantity, price);
  }
};
