const { v4: generateUuid } = require("uuid");
const Order = require("../../../exchange/Order");

module.exports = class OrderService {
  constructor(candlestickResolver, orderRegistry) {
    this.candlestickResolver = candlestickResolver;
    this.orderRegistry = orderRegistry;
  }

  async getOrdersFromIds(ids) {
    return this.orderRegistry.getOrdersFromIds(ids);
  }

  async getOpenOrdersFromIds(ids) {
    return this.orderRegistry.getOpenOrdersFromIds(ids);
  }

  async buyAtMarketPrice(timestamp, exchangeName, baseSymbol, quoteSymbol, baseQuantity) {
    const id = generateUuid();
    const lastCandlestick = await this.getLastCandlestick(exchangeName, baseSymbol, quoteSymbol, timestamp);
    const { closePrice: price } = lastCandlestick;
    const quoteQuantity = baseQuantity * price;
    const commission = quoteQuantity * 0.0001;

    const order = new Order(
      id,
      timestamp,
      Order.SIDE_BUY,
      Order.TYPE_MARKET,
      exchangeName,
      baseSymbol,
      quoteSymbol,
      price,
      baseQuantity
    );
    order.execute(timestamp, quoteQuantity - commission);

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
      exchangeName,
      baseSymbol,
      quoteSymbol,
      price,
      quoteQuantity
    );

    this.orderRegistry.register(order);

    return order;
  }

  async sellAtMarketPrice(timestamp, exchangeName, baseSymbol, quoteSymbol, quoteQuantity) {
    const id = generateUuid();
    const lastCandlestick = await this.getLastCandlestick(exchangeName, baseSymbol, quoteSymbol, timestamp);
    const { closePrice: price } = lastCandlestick;
    const baseQuantity = quoteQuantity / price;
    const commission = baseQuantity * 0.0001;

    const order = new Order(
      id,
      timestamp,
      Order.SIDE_SELL,
      Order.TYPE_MARKET,
      exchangeName,
      baseSymbol,
      quoteSymbol,
      price,
      quoteQuantity
    );
    order.execute(timestamp, baseQuantity - commission);

    this.orderRegistry.register(order);

    return order;
  }

  async getLastCandlestick(exchangeName, baseSymbol, quoteSymbol, timestamp) {
    const intervalMilliseconds = 1000 * 60 * 5;
    const startTimestamp = timestamp - intervalMilliseconds;
    const endTimestamp = timestamp;
    const candlesticks = await this.candlestickResolver.getCollection(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      "5m",
      startTimestamp,
      endTimestamp
    );
    return candlesticks[candlesticks.length - 1];
  }
};
