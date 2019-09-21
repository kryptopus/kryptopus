module.exports = class OrderRegistry {
  constructor() {
    this.orders = new Map();
  }

  async register(order) {
    this.orders.set(order.id, order);
  }

  async getOpenOrdersFromIds(ids) {
    const openOrders = [];

    for (const id of ids) {
      const order = this.orders.get(id);
      if (order && order.isOpen()) {
        openOrders.push(order);
      }
    }

    return openOrders;
  }
};
