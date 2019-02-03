const axios = require("axios");

module.exports = class WalletBalance {
  getName() {
    return "wallet:balance";
  }

  async execute(parameters) {
    const [asset, address] = parameters;
    let balance = 0;

    switch (asset.toUpperCase()) {
      case "BTC":
        {
          const response = await axios.get(`https://blockchain.info/q/addressbalance/${address}`);
          balance = response.data;
        }
        break;
      default:
        console.error(`Unknown asset: ${asset}`);
        process.exist(1);
    }

    console.info(balance);
  }
};
