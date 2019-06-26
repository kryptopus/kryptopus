const Binance = require("./binance/Binance");
const Kucoin = require("./kucoin/Kucoin");

module.exports = class ExchangeBuilder {
  constructor(accounts) {
    this.accounts = accounts;
    this.translators = new Map();
  }

  addSymbolTranslator(exchangeType, translator) {
    this.translators.set(exchangeType, translator);
  }

  buildAll() {
    const exchanges = [];
    for (const accountName in this.accounts) {
      exchanges.push(this.build(accountName));
    }

    return exchanges;
  }

  build(accountName) {
    const config = this.accounts[accountName];
    const translator = this.translators.get(config.type);

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
