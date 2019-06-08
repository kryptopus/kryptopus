const axios = require("axios");

module.exports = class WalletBalance {
  getName() {
    return "wallet:balance";
  }

  async execute(symbol, address) {
    let balance = 0;

    switch (symbol.toUpperCase()) {
      case "BTC":
        {
          const response = await axios.get(`https://blockchain.info/q/addressbalance/${address}`);
          balance = response.data;
        }
        break;
      default:
        throw new Error(`Unknown symbol: ${symbol}`);
    }

    console.info(balance);
  }
};
