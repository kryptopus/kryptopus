const assert = require("assert");
const assertPositiveInteger = require("../../util/number/assertPositiveInteger");
const assertPositiveNumber = require("../../util/number/assertPositiveNumber");

module.exports = class Candlestick {
  constructor(openTimestamp, closeTimestamp, openPrice, closePrice, lowestPrice, highestPrice, volume) {
    assertPositiveInteger(openTimestamp, new RangeError("Open timestamp must be a positive integer"));
    assertPositiveInteger(closeTimestamp, new RangeError("Close timestamp must be a positive integer"));
    assertPositiveNumber(openPrice, new RangeError("Open price must be a positive number"));
    assertPositiveNumber(closePrice, new RangeError("Close price must be a positive number"));
    assertPositiveNumber(lowestPrice, new RangeError("Lowest price must be a positive number"));
    assertPositiveNumber(highestPrice, new RangeError("Highest price must be a positive number"));
    assertPositiveNumber(volume, new RangeError(`Volume must be a positive number: ${volume}`));
    assert(
      openTimestamp < closeTimestamp,
      new RangeError(`Open timestamp (${openTimestamp}) should be lower than close timestamp (${closeTimestamp})`)
    );
    assert(
      lowestPrice <= openPrice && lowestPrice <= closePrice && lowestPrice <= highestPrice,
      new RangeError(
        `Lowest price (${lowestPrice}) should be lower than the other prices (Open: ${openPrice}, Close: ${closePrice}, High: ${highestPrice})`
      )
    );
    assert(
      highestPrice >= openPrice && highestPrice >= closePrice && highestPrice >= lowestPrice,
      new RangeError(
        `Lowest price (${lowestPrice}) should be higher than the other prices (Open: ${openPrice}, Close: ${closePrice}, Low: ${lowestPrice})`
      )
    );

    this.openTimestamp = openTimestamp;
    this.closeTimestamp = closeTimestamp;
    this.openPrice = openPrice;
    this.closePrice = closePrice;
    this.lowestPrice = lowestPrice;
    this.highestPrice = highestPrice;
    this.volume = volume;
  }

  isUp() {
    return this.closePrice > this.openPrice;
  }

  isDown() {
    return this.closePrice < this.openPrice;
  }
};
