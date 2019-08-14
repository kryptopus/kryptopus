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
      case "DRGN":
        {
          const response = await axios.get(
            `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e&address=${address}`
          );
          balance = response.data.result;
        }
        break;
      default:
        throw new Error(`Unknown symbol: ${symbol}`);
    }

    console.info(balance);
  }
};
