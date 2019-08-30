const convertIntervalToMilliseconds = require("../util/convertIntervalToMilliseconds");
const roundTimestampToInterval = require("../util/roundTimestampToInterval");
const Candlestick = require("./Candlestick");

module.exports = class CandlestickResolver {
  constructor(repository, collector) {
    this.repository = repository;
    this.collector = collector;
  }

  async getCollection(exchangeName, baseSymbol, quoteSymbol, interval, startTimestamp, endTimestamp) {
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const expectedCandlestickCount = Math.ceil((endTimestamp - startTimestamp) / intervalMilliseconds);

    const candlesticks = await this.repository.getCollection(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      interval,
      startTimestamp,
      endTimestamp
    );
    if (expectedCandlestickCount > candlesticks.length) {
      return this.resolveCollection(
        exchangeName,
        baseSymbol,
        quoteSymbol,
        startTimestamp,
        endTimestamp,
        interval,
        "5m"
      );
    }

    return candlesticks;
  }

  async resolveCollection(exchangeName, baseSymbol, quoteSymbol, startTimestamp, endTimestamp, interval, baseInterval) {
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const expectedCandlestickCount = Math.ceil((endTimestamp - startTimestamp) / intervalMilliseconds);

    const candlesticks = [];
    for (let index = 0; index < expectedCandlestickCount; index++) {
      const candlestickStartAt = startTimestamp + intervalMilliseconds * index;
      const candlestickEndAt = candlestickStartAt + intervalMilliseconds - 1;
      const candlestick = await this.buildCandlestickFromPeriod(
        exchangeName,
        baseSymbol,
        quoteSymbol,
        candlestickStartAt,
        candlestickEndAt,
        baseInterval
      );

      candlesticks.push(candlestick);
    }

    await this.repository.saveCollection(exchangeName, baseSymbol, quoteSymbol, interval, candlesticks);

    return candlesticks;
  }

  async buildCandlestickFromPeriod(exchangeName, baseSymbol, quoteSymbol, startTimestamp, endTimestamp, interval) {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(roundTimestampToInterval(endTimestamp, interval));

    const candlesticks = await this.repository.getCollection(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      interval,
      startTimestamp,
      endTimestamp
    );
    const total = candlesticks.length;
    if (total <= 0) {
      throw new Error(`Not enough base candlesticks to build a higher one. ${startDate} to ${endDate}`);
    }

    const { openPrice, openTimestamp } = candlesticks[0];
    const { closePrice, closeTimestamp } = candlesticks[total - 1];
    if (openTimestamp !== startTimestamp) {
      throw new Error(
        `Not enousgh base candlesticks to build a higher one. The first candlestick is missing: ${startDate}`
      );
    }
    if (closeTimestamp !== endTimestamp) {
      throw new Error(
        `Not enousgh base candlesticks to build a higher one. The last candlestick is missing: ${endDate}`
      );
    }

    let lowestPrice = openPrice;
    let highestPrice = openPrice;
    let volume = 0;
    for (const candlestick of candlesticks) {
      const { lowestPrice: candlestickLowestPrice, highestPrice: candlestickHighestPrice } = candlestick;
      if (Number(candlestickLowestPrice) < Number(lowestPrice)) {
        lowestPrice = candlestickLowestPrice;
      }

      if (Number(candlestickHighestPrice) > Number(highestPrice)) {
        highestPrice = candlestickHighestPrice;
      }

      volume += Number(candlestick.volume);
    }

    return new Candlestick(openTimestamp, closeTimestamp, openPrice, closePrice, lowestPrice, highestPrice, volume);
  }
};
