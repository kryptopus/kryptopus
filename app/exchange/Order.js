const assert = require("assert").strict;

const SIDE_BUY = "BUY";
const SIDE_SELL = "SELL";
const SIDES = [SIDE_BUY, SIDE_SELL];
const TYPE_LIMIT = "LIMIT";
const TYPES = [TYPE_LIMIT];
const STATUS_NEW = "NEW";
const STATUS_PARTIALLY_FILLED = "PARTIALLY_FILLED";
const STATUS_FILLED = "FILLED";
const STATUS_CANCELED = "CANCELED";
const STATUS_REJECTED = "REJECTED";
const STATUS_EXPIRED = "EXPIRED";
const STATUSES = [STATUS_NEW, STATUS_PARTIALLY_FILLED, STATUS_FILLED, STATUS_CANCELED, STATUS_REJECTED, STATUS_EXPIRED];
const OPEN_STATUSES = [STATUS_NEW, STATUS_PARTIALLY_FILLED];
const CLOSED_STATUSES = [STATUS_FILLED, STATUS_CANCELED, STATUS_REJECTED, STATUS_EXPIRED];

class Order {
  constructor(id, time, side, type, baseAsset, quoteAsset, status, price, quantity, executed) {
    assert(SIDES.includes(side), `Unable to create Order, unknown side: ${side}`);
    assert(TYPES.includes(type), `Unable to create Order, unknown type: ${type}`);
    assert(STATUSES.includes(status), `Unable to create Order, unknown status: ${status}`);

    this.id = id;
    this.time = time;
    this.side = side;
    this.type = type;
    this.status = status;
    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
    this.price = price;
    this.quantity = quantity;
    this.executed = executed;
  }

  isClosed() {
    return CLOSED_STATUSES.includes(this.status);
  }

  isOpen() {
    return OPEN_STATUSES.includes(this.status);
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

Object.defineProperties(Order, {
  STATUS_NEW: {
    value: STATUS_NEW,
    writable: false
  },
  STATUS_PARTIALLY_FILLED: {
    value: STATUS_PARTIALLY_FILLED,
    writable: false
  },
  STATUS_FILLED: {
    value: STATUS_FILLED,
    writable: false
  }
});

module.exports = Order;
