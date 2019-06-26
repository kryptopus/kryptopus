const BigNumber = require("bignumber.js");

module.exports = function formatPrice(price, maxDecimalPrecision = 10) {
  const bigPrice = new BigNumber(Number(price).toFixed(maxDecimalPrecision));
  const decimalPrecision = Math.min(bigPrice.dp(), maxDecimalPrecision);

  return bigPrice.toFixed(decimalPrecision);
};
