module.exports = class OrderRegistry {
  constructor() {
    this.orders = new Map();
  }

  async register(order) {
    this.orders.set(order.id, order);
  }

  async getOpenOrders() {
    const openOrders = [];

    for (const order of this.orders.values()) {
      if (order.isOpen()) {
        openOrders.push(order);
      }
    }

    return openOrders;
  }

  async getOrdersFromIds(ids) {
    const orders = [];

    for (const id of ids) {
      const order = this.orders.get(id);
      if (order) {
        orders.push(order);
      }
    }

    return orders;
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
