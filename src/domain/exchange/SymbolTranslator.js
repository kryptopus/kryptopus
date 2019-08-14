module.exports = class SymbolTranslator {
  constructor() {
    this.fromExchangeTranslations = new Map();
    this.toExchangeTranslations = new Map();
  }

  addTranslation(exchangeSymbol, universalSymbol) {
    this.fromExchangeTranslations.set(exchangeSymbol, universalSymbol);
    this.toExchangeTranslations.set(universalSymbol, exchangeSymbol);
  }

  fromExchange(symbol) {
    if (this.fromExchangeTranslations.has(symbol)) {
      return this.fromExchangeTranslations.get(symbol);
    }

    return symbol;
  }

  toExchange(symbol) {
    if (this.toExchangeTranslations.has(symbol)) {
      return this.toExchangeTranslations.get(symbol);
    }

    return symbol;
  }
};
