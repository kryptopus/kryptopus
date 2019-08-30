const assert = require("assert");

module.exports = function convertDateStringToTimestamp(dateString) {
  let timestamp;
  if (dateString === "now") {
    timestamp = Date.now();
  } else {
    timestamp = Date.parse(dateString);
  }

  assert(!Number.isNaN(timestamp), `Invalid date string: ${dateString}`);

  return timestamp;
};
