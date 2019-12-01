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
    const payload = await this.authenticatedRequest("/api/v3/account");
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

  async createOrder(side, type, baseSymbol, quoteSymbol, price, quantity) {
    const payload = await this.authenticatedPost("/api/v3/order", {
      symbol: `${baseSymbol}${quoteSymbol}`,
      side,
      type,
      timeInForce: "GTC",
      price,
      quantity
    });
    /*
    payload = {
      symbol: 'BTCUSDT',
      orderId: 841342394,
      orderListId: -1,
      clientOrderId: 'IOKuBxAwrlIksX2IrQ0nD9',
      transactTime: 1574880668756,
      price: '6500.00000000',
      origQty: '0.00200000',
      executedQty: '0.00000000',
      cummulativeQuoteQty: '0.00000000',
      status: 'NEW',
      timeInForce: 'GTC',
      type: 'LIMIT',
      side: 'BUY',
      fills: []
    }
    */

    const order = new Order(
      payload.orderId,
      payload.transactTime,
      payload.side,
      payload.type,
      this.name,
      baseSymbol,
      quoteSymbol,
      Number(payload.price),
      Number(payload.origQty)
    );
    return order;
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
    const normalizedOrders = await this.authenticatedRequest("/api/v3/openOrders");
    return this.denormalizeOrders(normalizedOrders);
  }

  denormalizeOrders(normalized) {
    return normalized.map(this.denormalizeOrder);
  }

  denormalizeOrder(normalized) {
    const symbol = this.symbols.get(normalized.symbol);
    const order = new Order(
      normalized.orderId,
      normalized.time,
      normalized.side,
      normalized.type,
      this.name,
      symbol.baseAsset,
      symbol.quoteAsset,
      Number(normalized.price),
      Number(normalized.origQty)
    );
    switch (normalized.status) {
      case Order.STATUS_PARTIALLY_FILLED:
        order.fillPartially(Number(normalized.executedQty));
        break;
      case Order.STATUS_FILLED:
        order.fill(Number(normalized.executedQty));
        break;
      case Order.STATUS_CANCELED:
        order.cancel();
        break;
      case Order.STATUS_REJECTED:
        order.reject();
        break;
      case Order.STATUS_EXPIRED:
        order.expire();
        break;
      default:
    }

    return order;
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

  async authenticatedPost(path, data) {
    assert(this.apiKey, "API key is missing");
    assert(this.apiSecret, "API secret is missing");

    const timestamp = Date.now();
    const queryArray = [];
    for (const property in data) {
      queryArray.push(`${property}=${data[property]}`);
    }
    queryArray.push(`timestamp=${timestamp}`);
    const queryString = queryArray.join("&");
    const signature = createHmac("sha256", this.apiSecret)
      .update(queryString)
      .digest("hex");
    const options = {
      hostname: "api.binance.com",
      port: 443,
      path: `${path}?${queryString}&signature=${signature}`,
      method: "POST",
      headers: {
        "X-MBX-APIKEY": this.apiKey
      }
    };

    const payload = await requestRemoteJson(options);
    this.assertPayload(payload);

    return payload;
  }

  async authenticatedRequest(path) {
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
