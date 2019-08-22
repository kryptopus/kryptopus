const assert = require("assert");

module.exports = class Candlestick {
  constructor(openTimestamp, closeTimestamp, openPrice, closePrice, lowestPrice, highestPrice, volume) {
    assert(typeof openTimestamp === "number", "Open timestamp is not a number");
    assert(typeof closeTimestamp === "number", "Open timestamp is not a number");
    assert(
      openTimestamp < closeTimestamp,
      `Open timestamp (${openTimestamp}) should be lower than close timestamp (${closeTimestamp})`
    );

    this.openTimestamp = openTimestamp;
    this.closeTimestamp = closeTimestamp;
    this.openPrice = openPrice;
    this.closePrice = closePrice;
    this.lowestPrice = lowestPrice;
    this.highestPrice = highestPrice;
    this.volume = volume;
  }
};
