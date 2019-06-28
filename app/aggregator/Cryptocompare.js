const requestRemoteJson = require("../util/requestRemoteJson");

module.exports = class Cryptocompare {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getSingleAssetPrice(baseAsset, quoteAsset) {
    const result = await this.request("/data/price", {
      fsym: baseAsset,
      tsyms: quoteAsset
    });

    return result;
  }

  async getMultipleAssetPrice(baseAssets, quoteAsset) {
    const result = await this.request("/data/pricemulti", {
      fsyms: baseAssets.join(","),
      tsyms: quoteAsset
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
