module.exports = function convertIntervalToMilliseconds(interval) {
  switch (interval) {
    case "1m":
      return 1000 * 60;
    case "5m":
      return 1000 * 60 * 5;
    case "15m":
      return 1000 * 60 * 15;
    case "30m":
      return 1000 * 60 * 30;
    case "1h":
      return 1000 * 60 * 60;
    case "2h":
      return 1000 * 60 * 60 * 2;
    case "4h":
      return 1000 * 60 * 60 * 4;
    case "6h":
      return 1000 * 60 * 60 * 6;
    case "12h":
      return 1000 * 60 * 60 * 12;
    case "1d":
      return 1000 * 60 * 60 * 24;
    default:
  }

  throw new Error(`Unknown interval: ${interval}`);
};
