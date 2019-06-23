const formatPrice = require("../formatPrice");

describe("formatPrice", () => {
  it("should return price as string", () => {
    expect(formatPrice(1337)).toEqual("1337");
  });

  it("should accept string", () => {
    expect(formatPrice("42")).toEqual("42");
  });

  it("should accept decimal", () => {
    expect(formatPrice(13.37)).toEqual("13.37");
  });

  it("should accept decimal string", () => {
    expect(formatPrice("13.37")).toEqual("13.37");
  });

  it("should round to 10 decimal", () => {
    expect(formatPrice(13.12345678912345)).toEqual("13.1234567891");
  });

  it("should not output trailing zero", () => {
    expect(formatPrice(13.19999999999)).toEqual("13.2");
  });
});
