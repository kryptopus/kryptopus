const Binance = require("./binance/Binance");
const Kucoin = require("./kucoin/Kucoin");

module.exports = function buildExchange(config) {
  switch (config.type) {
    case "binance": {
      const { apiKey, apiSecret } = config;
      return new Binance(apiKey, apiSecret);
    }

    case "kucoin": {
      const { apiKey, apiSecret, apiPassphrase } = config;
      return new Kucoin(apiKey, apiSecret, apiPassphrase);
    }

    default:
  }

  throw new Error(`Unable to build exchange instance, unknown type: ${config.type}`);
};
