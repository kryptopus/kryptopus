const assert = require("assert").strict;

module.exports = function assertNonEmptyString(value, message) {
  assert(typeof value === "string", message);
  assert(value.length > 0, message);
};
