const convertIntervalToMilliseconds = require("./convertIntervalToMilliseconds");

module.exports = function roundTimestampToInterval(timestamp, interval) {
  const milliseconds = convertIntervalToMilliseconds(interval);

  return timestamp - (timestamp % milliseconds);
};
