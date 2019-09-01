const convertIntervalToMilliseconds = require("../util/convertIntervalToMilliseconds");
const Candlestick = require("./Candlestick");

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

    const firstCandlestick = candlesticks[0];
    const lastCandlestick = candlesticks[candlesticks.length - 1];
    const completedCandlesticks = this.completeMissingCandlesticks(
      candlesticks,
      interval,
      firstCandlestick.openTimestamp,
      lastCandlestick.closeTimestamp
    );

    await this.candlestickRepository.saveCollection(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      interval,
      completedCandlesticks
    );

    return completedCandlesticks;
  }

  completeMissingCandlesticks(candlesticks, interval, startTimestamp, endTimestamp) {
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const expectedCandlestickCount = Math.ceil((endTimestamp - startTimestamp) / intervalMilliseconds);

    if (!candlesticks.length || expectedCandlestickCount === candlesticks.length) {
      return candlesticks;
    }

    const firstCandlestick = candlesticks[0];
    if (firstCandlestick.openTimestamp !== startTimestamp) {
      const date = new Date(startTimestamp);
      throw new Error(`The first candlestick is required to complete a collection: ${date}`);
    }

    const completedCandlesticks = [firstCandlestick];
    let lastCandlestickIndex = 1;
    for (let index = 1; index < expectedCandlestickCount; index++) {
      const expectedOpenTimestamp = startTimestamp + intervalMilliseconds * index;

      if (lastCandlestickIndex > candlesticks.length - 1) {
        // Do not complete after the last collected candlestick
        break;
      }

      const candlestick = candlesticks[lastCandlestickIndex];
      if (candlestick.openTimestamp === expectedOpenTimestamp) {
        completedCandlesticks.push(candlestick);
        lastCandlestickIndex++;
        continue;
      }

      const lastClosePrice = candlesticks[lastCandlestickIndex].closePrice;
      completedCandlesticks.push(
        new Candlestick(
          expectedOpenTimestamp,
          expectedOpenTimestamp + intervalMilliseconds - 1,
          lastClosePrice,
          lastClosePrice,
          lastClosePrice,
          lastClosePrice,
          0
        )
      );
    }

    return completedCandlesticks;
  }
};
