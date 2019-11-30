const SellPercentageAtLimitPrice = require("./SellPercentageAtLimitPrice");

module.exports = class SellPercentageAtLimitPriceFactory {
  build(exchangeName, baseSymbol, quoteSymbol, percentage, price) {
    return new SellPercentageAtLimitPrice(exchangeName, baseSymbol, quoteSymbol, percentage, price);
  }
};
