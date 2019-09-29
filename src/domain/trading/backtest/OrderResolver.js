module.exports = class OrderResolver {
  constructor(registry, candlestickResolver) {
    this.registry = registry;
    this.candlestickResolver = candlestickResolver;
  }

  async resolveAtTimestamp(timestamp) {
    const openOrders = await this.registry.getOpenOrders();
    const pastOpenOrders = openOrders.filter(order => {
      return order.time < timestamp;
    });

    for (const pastOpenOrder of pastOpenOrders) {
      await this.resolveOrderAtTimestamp(pastOpenOrder, timestamp);
    }
  }

  async resolveOrderAtTimestamp(order, timestamp) {
    const startTimestamp = order.time;
    const endTimestamp = timestamp;
    const candlesticks = await this.candlestickResolver.getCollection(
      order.exchangeName,
      order.baseSymbol,
      order.quoteSymbol,
      "5m",
      startTimestamp,
      endTimestamp
    );

    for (const candlestick of candlesticks) {
      if (order.time > candlestick.openTimestamp) {
        continue;
      }

      if (!order.isLimitType()) {
        continue;
      }

      if (order.price > candlestick.lowestPrice && order.price < candlestick.highestPrice) {
        if (order.isBuying()) {
          const quoteQuantity = order.baseQuantity * order.price;
          const commission = quoteQuantity * 0.0001;
          order.execute(candlestick.closeTimestamp, quoteQuantity - commission);
        } else {
          const baseQuantity = order.quoteQuantity / order.price;
          const commission = baseQuantity * 0.0001;
          order.execute(candlestick.closeTimestamp, baseQuantity - commission);
        }
      }
    }
  }
};
