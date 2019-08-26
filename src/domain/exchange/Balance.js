const assert = require("assert");

module.exports = class Balance {
  constructor(symbol, total, inOrder) {
    assert(!Number.isNaN(total), `Unable to instantiate Balance, "total" is not a number: ${total}`);
    assert(!Number.isNaN(inOrder), `Unable to instantiate Balance, "inOrder" is not a number: ${total}`);

    this.symbol = symbol;
    this.total = Number(total);
    this.inOrder = Number(inOrder);
    this.available = this.total - this.inOrder;
  }
};
