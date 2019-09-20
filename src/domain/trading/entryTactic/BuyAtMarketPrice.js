module.exports = class BuyAtMarketPrice {
  constructor(exchangeName, baseSymbol, quoteSymbol, baseQuantity) {
    this.exchangeName = exchangeName;
    this.baseSymbol = baseSymbol;
    this.quoteSymbol = quoteSymbol;
    this.baseQuantity = baseQuantity;
  }

  execute(position, orderService) {
    console.log(position, orderService);
  }
};
