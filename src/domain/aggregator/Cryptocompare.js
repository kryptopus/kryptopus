const requestRemoteJson = require("../../util/requestRemoteJson");

module.exports = class Cryptocompare {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getSingleAssetPrice(baseSymbol, quoteSymbol) {
    const result = await this.request("/data/price", {
      fsym: baseSymbol,
      tsyms: quoteSymbol
    });

    return result;
  }

  async getMultipleAssetPrice(baseSymbols, quoteSymbol) {
    const result = await this.request("/data/pricemulti", {
      fsyms: baseSymbols.join(","),
      tsyms: quoteSymbol
    });

    return result;
  }

  request(path, parameters) {
    const queryArray = Object.entries(parameters).map(entry => {
      return `${entry[0]}=${entry[1]}`;
    });
    const queryString = queryArray.join("&");

    const options = {
      hostname: "min-api.cryptocompare.com",
      port: 443,
      path: `${path}?${queryString}`,
      method: "GET",
      headers: {
        Authorization: `apiKey ${this.apiKey}`
      }
    };

    return requestRemoteJson(options);
  }
};
