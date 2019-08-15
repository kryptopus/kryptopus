const assert = require("assert");

module.exports = class Exchange {
  constructor() {
    assert.strictEqual(
      typeof this.getName,
      "function",
      `Missing "getName" method in exchange: ${this.constructor.name}`
    );

    assert.strictEqual(
      typeof this.getBalances,
      "function",
      `Missing "getBalances" method in exchange: ${this.constructor.name}`
    );
  }
};
