const convertIntervalToMilliseconds = require("../convertIntervalToMilliseconds");

describe("convertIntervalToMilliseconds()", () => {
  it("should convert known intervals", () => {
    expect(convertIntervalToMilliseconds("1m")).toEqual(60000);
    expect(convertIntervalToMilliseconds("5m")).toEqual(300000);
    expect(convertIntervalToMilliseconds("15m")).toEqual(900000);
    expect(convertIntervalToMilliseconds("30m")).toEqual(1800000);
    expect(convertIntervalToMilliseconds("1h")).toEqual(3600000);
    expect(convertIntervalToMilliseconds("2h")).toEqual(7200000);
    expect(convertIntervalToMilliseconds("4h")).toEqual(14400000);
    expect(convertIntervalToMilliseconds("6h")).toEqual(21600000);
    expect(convertIntervalToMilliseconds("12h")).toEqual(43200000);
    expect(convertIntervalToMilliseconds("1d")).toEqual(86400000);
  });

  it("should throw an error on unknown interval", () => {
    expect(() => {
      convertIntervalToMilliseconds("7m");
    }).toThrow();
  });
});
