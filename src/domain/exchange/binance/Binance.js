const assert = require("assert");
const { createHmac } = require("crypto");
const requestRemoteJson = require("../../../util/requestRemoteJson");
const Order = require("../Order");
const Balance = require("../Balance");
const Exchange = require("../Exchange");
const Candlestick = require("../../technicalAnalysis/Candlestick");

module.exports = class Binance extends Exchange {
  constructor(name, translator, apiKey, apiSecret) {
    super();

    this.name = name;
    this.translator = translator;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.symbols = null;

    this.denormalizeOrder = this.denormalizeOrder.bind(this);
    this.denormalizeBalance = this.denormalizeBalance.bind(this);
  }

  getName() {
    return this.name;
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

  async getInformations() {
    const payload = await this.anonymousRequest("/api/v1/exchangeInfo");
    delete payload.symbols;
    return payload;
  }

  async getBalances() {
    const payload = await this.request("/api/v3/account");
    return this.denormalizeBalances(payload.balances.filter(this.isNonEmptyBalance));
  }

  async getCandlesticks(baseSymbol, quoteSymbol, interval, startTime, endTime) {
    const symbol = this.translator.toExchange(baseSymbol) + this.translator.toExchange(quoteSymbol);
    const payload = await this.anonymousRequest("/api/v1/klines", {
      symbol,
      interval,
      startTime,
      endTime,
      limit: 1000
    });
    return this.denormalizeCandlesticks(payload);
  }

  isNonEmptyBalance(normalizedBalance) {
    return Number(normalizedBalance.free) + Number(normalizedBalance.locked) > 0;
  }

  denormalizeBalances(normalizedBalances) {
    return normalizedBalances.map(this.denormalizeBalance);
  }

  denormalizeBalance(normalized) {
    return new Balance(
      this.translator.fromExchange(normalized.asset),
      Number(normalized.free) + Number(normalized.locked),
      Number(normalized.locked)
    );
  }

  denormalizeCandlesticks(normalized) {
    return normalized.map(this.denormalizeCandlestick);
  }

  denormalizeCandlestick(normalized) {
    const [openTimestamp, openPrice, highestPrice, lowestPrice, closePrice, volume, closeTimestamp] = normalized;

    return new Candlestick(
      Number(openTimestamp),
      Number(closeTimestamp),
      Number(openPrice),
      Number(closePrice),
      Number(lowestPrice),
      Number(highestPrice),
      Number(volume)
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

  async anonymousRequest(path, query) {
    const queryArray = [];
    if (query) {
      for (const queryName in query) {
        queryArray.push(`${queryName}=${query[queryName]}`);
      }
    }
    const queryString = queryArray.join("&");

    const options = {
      hostname: "api.binance.com",
      port: 443,
      path: `${path}?${queryString}`,
      method: "GET"
    };

    const payload = await requestRemoteJson(options);
    this.assertPayload(payload);

    return payload;
  }

  async request(path) {
    assert(this.apiKey, "API key is missing");
    assert(this.apiSecret, "API secret is missing");

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

    const payload = await requestRemoteJson(options);
    this.assertPayload(payload);

    return payload;
  }

  assertPayload(payload) {
    if (payload.code && payload.msg) {
      throw new Error(`[Code ${payload.code}] ${payload.msg}`);
    }
  }
};
