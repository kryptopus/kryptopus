const Candlestick = require("../Candlestick");

describe("Candlestick", () => {
  it("should store candlestick values", () => {
    const candlestick = new Candlestick(1, 2, 10, 20, 9, 21, 1337);
    expect(candlestick.openTimestamp).toEqual(1);
    expect(candlestick.closeTimestamp).toEqual(2);
    expect(candlestick.openPrice).toEqual(10);
    expect(candlestick.closePrice).toEqual(20);
    expect(candlestick.lowestPrice).toEqual(9);
    expect(candlestick.highestPrice).toEqual(21);
    expect(candlestick.volume).toEqual(1337);
  });

  it("should throw an error if the openTimestamp is higher than closeTimestamp", () => {
    expect(() => {
      return new Candlestick(2, 1);
    }).toThrow();
  });

  it("should throw an error if the openTimestamp is not an integer", () => {
    expect(() => {
      return new Candlestick(13.37);
    }).toThrow();
  });

  it("should throw an error if the openTimestamp is not positive", () => {
    expect(() => {
      return new Candlestick(-13);
    }).toThrow();
  });

  it("should throw an error if the closeTimestamp is not an integer", () => {
    expect(() => {
      return new Candlestick(1, 13.37);
    }).toThrow();
  });

  it("should throw an error if the closeTimestamp is not positive", () => {
    expect(() => {
      return new Candlestick(1, -13);
    }).toThrow();
  });

  it("should throw an error if the openPrice is not positive", () => {
    expect(() => {
      return new Candlestick(1, 2, -10);
    }).toThrow();
  });

  it("should throw an error if the closePrice is not positive", () => {
    expect(() => {
      return new Candlestick(1, 2, 10, -20);
    }).toThrow();
  });

  it("should throw an error if the lowestPrice is not positive", () => {
    expect(() => {
      return new Candlestick(1, 2, 10, 20, -9);
    }).toThrow();
  });

  it("should throw an error if the highestPrice is not positive", () => {
    expect(() => {
      return new Candlestick(1, 2, 10, 20, 9, -21);
    }).toThrow();
  });

  it("should throw an error if the volume is not positive", () => {
    expect(() => {
      return new Candlestick(1, 2, 10, 20, 9, 21, -1337);
    }).toThrow();
  });

  it("should throw an error if the lowestPrice is not the lowest price", () => {
    expect(() => {
      return new Candlestick(1, 2, 10, 20, 11, 21, 1337);
    }).toThrow();
  });

  it("should throw an error if the highestPrice is not the highest price", () => {
    expect(() => {
      return new Candlestick(1, 2, 10, 20, 9, 19, 1337);
    }).toThrow();
  });
});
