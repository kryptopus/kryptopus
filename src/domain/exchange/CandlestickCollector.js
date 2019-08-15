module.exports = class CandlestickCollector {
  constructor(exchangeBuilder) {
    this.exchangeBuilder = exchangeBuilder;
  }

  async collect(exchangeName, baseSymbol, quoteSymbol, interval) {
    const exchange = this.exchangeBuilder.build(exchangeName);
    const result = await exchange.getCandlesticks(baseSymbol, quoteSymbol, interval);
    console.log(result);
  }
};
