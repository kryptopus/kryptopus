module.exports = class CandlestickCollector {
  constructor(exchangeBuilder, candlestickRepository) {
    this.exchangeBuilder = exchangeBuilder;
    this.candlestickRepository = candlestickRepository;
  }

  async collect(exchangeName, baseSymbol, quoteSymbol, interval) {
    const exchange = this.exchangeBuilder.build(exchangeName);
    const candlesticks = await exchange.getCandlesticks(baseSymbol, quoteSymbol, interval);

    return this.candlestickRepository.saveCollection(exchangeName, baseSymbol, quoteSymbol, interval, candlesticks);
  }
};
