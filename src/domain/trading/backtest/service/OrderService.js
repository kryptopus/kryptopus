const { v4: generateUuid } = require("uuid");
const Order = require("../../../exchange/Order");

module.exports = class OrderService {
  constructor(candlestickResolver, orderRegistry) {
    this.candlestickResolver = candlestickResolver;
    this.orderRegistry = orderRegistry;
  }

  async getOpenOrdersFromIds(ids) {
    return this.orderRegistry.getOpenOrdersFromIds(ids);
  }

  async buyAtMarketPrice(timestamp, exchangeName, baseSymbol, quoteSymbol, baseQuantity) {
    const id = generateUuid();
    const lastCandlestick = await this.getLastCandlestick(timestamp);
    const { closePrice: price } = lastCandlestick;
    const quoteQuantity = baseQuantity * price;
    const commission = quoteQuantity * 0.0001;

    const order = new Order(
      id,
      timestamp,
      Order.SIDE_BUY,
      Order.TYPE_MARKET,
      baseSymbol,
      quoteSymbol,
      Order.STATUS_FILLED,
      price,
      baseQuantity,
      quoteQuantity - commission,
      true
    );

    this.orderRegistry.register(order);

    return order;
  }

  async sellAtLimitPrice(timestamp, exchangeName, baseSymbol, quoteSymbol, quoteQuantity, price) {
    const id = generateUuid();

    const order = new Order(
      id,
      timestamp,
      Order.SIDE_SELL,
      Order.TYPE_LIMIT,
      baseSymbol,
      quoteSymbol,
      Order.STATUS_NEW,
      price,
      0,
      quoteQuantity,
      false
    );

    this.orderRegistry.register(order);

    return order;
  }

  async getLastCandlestick(timestamp) {
    const intervalMilliseconds = 1000 * 60 * 5;
    const startTimestamp = timestamp - intervalMilliseconds;
    const endTimestamp = timestamp;
    const candlesticks = await this.candlestickResolver.getCollection(
      "binance",
      "BTC",
      "USDT",
      "5m",
      startTimestamp,
      endTimestamp
    );
    return candlesticks[candlesticks.length - 1];
  }
};
