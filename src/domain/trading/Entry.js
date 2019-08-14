const assert = require("assert").strict;
const Order = require("../exchange/Order");

module.exports = class Entry {
  constructor(id) {
    this.id = id;
    this.openOrders = new Map();
    this.closedOrders = new Map();
  }

  addOrder(order) {
    assert(order instanceof Order, "Unable to add order to trading entry, it is not an instance of Order");

    if (order.isOpen()) {
      this.openOrders.set(order.id, order);
    } else {
      this.closedOrders.set(order.id, order);
    }
  }
};
