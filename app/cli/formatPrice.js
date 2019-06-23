const BigNumber = require("bignumber.js");
const { yellow, dim } = require("colors/safe");

function colorizePrice(price) {
  const array = String(price).split("");
  let findNonZero = false;
  for (let index = array.length - 1; index >= 0; index--) {
    if (findNonZero) {
      array[index] = yellow(array[index]);
      continue;
    }

    if (array[index] === "0" || array[index] === ".") {
      array[index] = dim(array[index]);
      continue;
    }

    array[index] = yellow(array[index]);
    findNonZero = true;
  }

  return array.join("");
}

module.exports = function formatPrice(price) {
  const bigPrice = new BigNumber(Number(price).toFixed(10));
  const decimalPrecision = Math.min(bigPrice.dp(), 10);

  const fixedPrice = bigPrice.toFixed(decimalPrecision);
  const formattedPrice = colorizePrice(fixedPrice);
  return formattedPrice;
};
