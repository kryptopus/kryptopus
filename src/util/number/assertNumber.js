const assert = require("assert").strict;

module.exports = function assertNumber(value, message) {
  assert(typeof value === "number", message);
};
