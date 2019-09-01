const assert = require("assert").strict;

const intervals = ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12", "1d"];

module.exports = function assertKnownInterval(interval) {
  assert(
    intervals.includes(interval),
    new RangeError(`Unknown interval "${interval}". It must be one of these values: ${intervals.join(", ")}`)
  );
};
