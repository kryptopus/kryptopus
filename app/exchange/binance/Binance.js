const https = require("https");
const { createHmac } = require("crypto");
const Order = require("../Order");
const Balance = require("../Balance");

module.exports = class Binance {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.symbols = null;

    this.denormalizeOrder = this.denormalizeOrder.bind(this);
  }

  async fetchInfo() {
    const payload = await this.anonymousRequest("/api/v1/exchangeInfo");
    this.symbols = new Map();
    payload.symbols.forEach(symbol => {
      this.symbols.set(symbol.symbol, symbol);
    });
  }

  async ensureInfoFetched() {
    if (!this.symbols) {
      await this.fetchInfo();
    }
  }

  async getBalances() {
    const payload = await this.request("/api/v3/account");
    return this.denormalizeBalances(payload.balances.filter(this.isNonEmptyBalance));
  }

  isNonEmptyBalance(normalizedBalance) {
    return Number(normalizedBalance.free) + Number(normalizedBalance.locked) > 0;
  }

  denormalizeBalances(normalizedBalances) {
    return normalizedBalances.map(this.denormalizeBalance);
  }

  denormalizeBalance(normalized) {
    return new Balance(
      normalized.asset,
      Number(normalized.free) + Number(normalized.locked),
      Number(normalized.locked)
    );
  }

  async getOpenOrders() {
    await this.ensureInfoFetched();
    const normalizedOrders = await this.request("/api/v3/openOrders");
    return this.denormalizeOrders(normalizedOrders);
  }

  denormalizeOrders(normalized) {
    return normalized.map(this.denormalizeOrder);
  }

  denormalizeOrder(normalized) {
    const symbol = this.symbols.get(normalized.symbol);
    return new Order(
      normalized.orderId,
      normalized.time,
      normalized.side,
      normalized.type,
      symbol.baseAsset,
      symbol.quoteAsset,
      normalized.status,
      normalized.price,
      normalized.origQty,
      normalized.executedQty
    );
  }

  anonymousRequest(path) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "api.binance.com",
        port: 443,
        path,
        method: "GET"
      };
      https
        .request(options, response => {
          const chunks = [];
          response.on("data", data => {
            chunks.push(data.toString());
          });
          response.on("end", () => {
            const json = chunks.join("");
            resolve(JSON.parse(json.toString()));
          });
        })
        .on("error", error => {
          reject(error);
        })
        .end();
    });
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
          const chunks = [];
          response.on("data", chunk => {
            chunks.push(chunk);
          });
          response.on("end", () => {
            const data = chunks.join();
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
