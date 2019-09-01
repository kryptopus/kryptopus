const assert = require("assert");

module.exports = function assertPositiveInteger(value, message) {
  assert(typeof value === "number", message);
  assert(value === parseInt(value, 10), message);
  assert(value >= 0, message);
};
