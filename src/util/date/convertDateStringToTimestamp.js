const assert = require("assert");

module.exports = function convertDateStringToTimestamp(dateString) {
  const timestamp = Date.parse(dateString);

  assert(!Number.isNaN(timestamp), `Invalid date string: ${dateString}`);

  return timestamp;
};
