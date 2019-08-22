module.exports = class CandlestickCollector {
  constructor(exchangeBuilder, candlestickRepository) {
    this.exchangeBuilder = exchangeBuilder;
    this.candlestickRepository = candlestickRepository;
  }

  async collect(exchangeName, baseSymbol, quoteSymbol, interval, startTimestamp, endTimestamp) {
    const exchange = this.exchangeBuilder.build(exchangeName);
    const candlesticks = await exchange.getCandlesticks(
      baseSymbol,
      quoteSymbol,
      interval,
      startTimestamp,
      endTimestamp
    );

    await this.candlestickRepository.saveCollection(exchangeName, baseSymbol, quoteSymbol, interval, candlesticks);

    return candlesticks;
  }
};
