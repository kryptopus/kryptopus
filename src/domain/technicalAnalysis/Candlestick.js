const assert = require("assert");

module.exports = class Candlestick {
  constructor(openTimestamp, closeTimestamp, openPrice, closePrice, lowestPrice, highestPrice, volume) {
    assert(typeof openTimestamp === "number", "Open timestamp is not a number");
    assert(typeof closeTimestamp === "number", "Open timestamp is not a number");
    assert(
      openTimestamp < closeTimestamp,
      `Open timestamp (${openTimestamp}) should be lower than close timestamp (${closeTimestamp})`
    );
    assert(
      Number(lowestPrice) <= Number(openPrice) &&
        Number(lowestPrice) <= Number(closePrice) &&
        Number(lowestPrice) <= Number(highestPrice),
      `Lowest price (${lowestPrice}) should be lower than the other prices (Open: ${openPrice}, Close: ${closePrice}, High: ${highestPrice})`
    );
    assert(
      Number(highestPrice) >= Number(openPrice) &&
        Number(highestPrice) >= Number(closePrice) &&
        Number(highestPrice) >= Number(lowestPrice),
      `Lowest price (${lowestPrice}) should be higher than the other prices (Open: ${openPrice}, Close: ${closePrice}, Low: ${lowestPrice})`
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
