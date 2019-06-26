const https = require("https");
const { createHmac } = require("crypto");
const Balance = require("../Balance");

module.exports = class Kucoin {
  constructor(name, translator, apiKey, apiSecret, apiPassphrase) {
    this.name = name;
    this.translator = translator;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.apiPassphrase = apiPassphrase;
  }

  getName() {
    return this.name;
  }

  async getBalances() {
    const normalizedBalances = await this.request("/api/v1/accounts");
    return this.denormalizeBalances(normalizedBalances.filter(this.isTradeBalance));
  }

  isTradeBalance(normalizedBalance) {
    return normalizedBalance.type === "trade";
  }

  denormalizeBalances(normalizedBalances) {
    return normalizedBalances.map(this.denormalizeBalance);
  }

  denormalizeBalance(normalized) {
    return new Balance(normalized.currency, normalized.balance, normalized.holds);
  }

  request(path) {
    return new Promise((resolve, reject) => {
      const method = "GET";
      const timestamp = Date.now();
      const body = "";
      const stringToSign = timestamp + method + path + body;
      const signature = createHmac("sha256", this.apiSecret)
        .update(stringToSign)
        .digest();
      const signatureBase64 = Buffer.from(signature).toString("base64");
      const options = {
        hostname: "openapi-v2.kucoin.com",
        port: 443,
        path,
        method,
        headers: {
          "Content-Type": "application/json",
          "KC-API-KEY": this.apiKey,
          "KC-API-TIMESTAMP": timestamp,
          "KC-API-SIGN": signatureBase64,
          "KC-API-PASSPHRASE": this.apiPassphrase
        }
      };
      https
        .request(options, response => {
          const chunks = [];
          response.on("data", chunk => {
            chunks.push(chunk);
          });
          response.on("end", () => {
            const data = chunks.join();
            const payload = JSON.parse(data.toString());

            if (payload.code !== "200000") {
              reject(new Error(`Unable to fetch ${path}, error code ${payload.code}: ${payload.msg}`));
              return;
            }

            resolve(payload.data);
          });
        })
        .on("error", error => {
          reject(error);
        })
        .end();
    });
  }
};
