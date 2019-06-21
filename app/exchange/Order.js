module.exports = class Order {
  constructor(id, time, side, type, baseAsset, quoteAsset, status, price, quantity, executed) {
    this.id = id;
    this.time = time;
    this.side = side;
    this.type = type;
    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
    this.status = status;
    this.price = price;
    this.quantity = quantity;
    this.executed = executed;
  }
};
