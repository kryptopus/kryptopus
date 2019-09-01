const assert = require("assert");

module.exports = function assertPositiveNumber(value, message) {
  assert(typeof value === "number", message);
  assert(value >= 0, message);
};
