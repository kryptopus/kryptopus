const assertNonEmptyString = require("../../util/string/assertNonEmptyString");

module.exports = class SymbolPair {
  constructor(baseSymbol, quoteSymbol) {
    assertNonEmptyString(baseSymbol, new TypeError(`Base symbol must be a non empty string: "${baseSymbol}"`));
    assertNonEmptyString(quoteSymbol, new TypeError(`Quote symbol must be a non empty string: "${quoteSymbol}"`));

    this.baseSymbol = baseSymbol;
    this.quoteSymbol = quoteSymbol;
  }
};
