const SIDE_BUY = "BUY";
const SIDE_SELL = "SELL";
const SIDES = [SIDE_BUY, SIDE_SELL];
const TYPE_LIMIT = "LIMIT";
const TYPES = [TYPE_LIMIT];

class Order {
  constructor(id, time, side, type, baseAsset, quoteAsset, status, price, quantity, executed) {
    this.id = id;
    this.time = time;

    if (!SIDES.includes(side)) {
      throw new Error(`Unable to create Order, unknown side: ${side}`);
    }
    this.side = side;

    if (!TYPES.includes(type)) {
      throw new Error(`Unable to create Order, unknown type: ${type}`);
    }
    this.type = type;

    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
    this.status = status;
    this.price = price;
    this.quantity = quantity;
    this.executed = executed;
  }
}

Object.defineProperties(Order, {
  SIDE_BUY: {
    value: SIDE_BUY,
    writable: false
  },
  SIDE_SELL: {
    value: SIDE_SELL,
    writable: false
  }
});

module.exports = Order;
