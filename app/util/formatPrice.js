const BigNumber = require("bignumber.js");

module.exports = function formatPrice(price) {
  const bigPrice = new BigNumber(Number(price).toFixed(10));
  const decimalPrecision = Math.min(bigPrice.dp(), 10);

  return bigPrice.toFixed(decimalPrecision);
};
