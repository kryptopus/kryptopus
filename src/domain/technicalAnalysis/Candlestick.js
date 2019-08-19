module.exports = class Candlestick {
  constructor(openTimestamp, closeTimestamp, openPrice, closePrice, lowestPrice, highestPrice, volume) {
    this.openTimestamp = openTimestamp;
    this.closeTimestamp = closeTimestamp;
    this.openPrice = openPrice;
    this.closePrice = closePrice;
    this.lowestPrice = lowestPrice;
    this.highestPrice = highestPrice;
    this.volume = volume;
  }
};
