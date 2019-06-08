const https = require("https");
const { createHmac } = require("crypto");

module.exports = class Binance {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async getBalances() {
    const balances = await this.request("/api/v3/account");
    return balances;
  }

  request(path) {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = createHmac("sha256", this.apiSecret)
        .update(queryString)
        .digest("hex");
      const options = {
        hostname: "api.binance.com",
        port: 443,
        path: `${path}?${queryString}&signature=${signature}`,
        method: "GET",
        headers: {
          "X-MBX-APIKEY": this.apiKey
        }
      };
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
