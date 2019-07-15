const requestRemoteJson = require("../util/requestRemoteJson");

module.exports = class Dragonchain {
  getBalance(address) {
    const options = {
      hostname: "api.etherscan.io",
      port: 443,
      path: `api?module=account&action=tokenbalance&contractaddress=0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e&address=${address}`,
      method: "GET"
    };

    return requestRemoteJson(options);
  }
};
