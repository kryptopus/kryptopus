const requestRemoteJson = require("../../util/requestRemoteJson");

module.exports = class Etherum {
  getBalance(address) {
    const options = {
      hostname: "api.etherscan.io",
      port: 443,
      path: `/api?module=account&action=balance&address=${address}`,
      method: "GET"
    };

    return requestRemoteJson(options);
  }
};
