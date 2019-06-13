const https = require("https");

module.exports = class Cryptocompare {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getSingleSymbolPrice(baseSymbol, quoteSymbols) {
    const result = await this.request("/data/price", {
      fsym: baseSymbol,
      tsyms: quoteSymbols.join(",")
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

    return new Promise((resolve, reject) => {
      https
        .request(options, response => {
          response.on("data", data => {
            resolve(JSON.parse(data.toString()));
          });
        })
        .on("error", error => {
          reject(error);
        })
        .end();
    });
  }
};
