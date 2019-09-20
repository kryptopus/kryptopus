const BuyAtMarketPrice = require("./BuyAtMarketPrice");

module.exports = class BuyAtMarketPriceFactory {
  build(exchangeName, baseSymbol, quoteSymbol, baseAmount) {
    return new BuyAtMarketPrice(exchangeName, baseSymbol, quoteSymbol, baseAmount);
  }
};
