const Binance = require("./binance/Binance");
const Kucoin = require("./kucoin/Kucoin");
const SymbolTranslator = require("./SymbolTranslator");

module.exports = class ExchangeBuilder {
  constructor(accountConfigs) {
    this.accountConfigs = accountConfigs;
    this.translators = new Map();
  }

  addSymbolTranslator(exchangeType, translator) {
    this.translators.set(exchangeType, translator);
  }

  build(type) {
    const translator = this.translators.get(type) || new SymbolTranslator();

    switch (type) {
      case "binance": {
        return new Binance("binance", translator);
      }

      case "kucoin": {
        return new Kucoin("kucoin", translator);
      }

      default:
    }

    throw new Error(`Unable to build exchange instance, unknown type: ${type}`);
  }

  buildAccounts() {
    const accounts = [];
    for (const accountName in this.accountConfigs) {
      accounts.push(this.buildAccount(accountName));
    }

    return accounts;
  }

  buildAccount(accountName) {
    const config = this.accountConfigs[accountName];
    if (!config) {
      throw new RangeError(`Unable to build exchange instance, unknown account name: ${accountName}`);
    }

    const translator = this.translators.get(config.type) || new SymbolTranslator();

    switch (config.type) {
      case "binance": {
        const { apiKey, apiSecret } = config;
        return new Binance(accountName, translator, apiKey, apiSecret);
      }

      case "kucoin": {
        const { apiKey, apiSecret, apiPassphrase } = config;
        return new Kucoin(accountName, translator, apiKey, apiSecret, apiPassphrase);
      }

      default:
    }

    throw new Error(`Unable to build exchange instance, unknown type: ${config.type}`);
  }
};
