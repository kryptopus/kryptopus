const assert = require("assert");
const assertNumber = require("./assertNumber");

module.exports = function assertPositiveNumber(value, message) {
  assertNumber(value, message);
  assert(value >= 0, message);
};
