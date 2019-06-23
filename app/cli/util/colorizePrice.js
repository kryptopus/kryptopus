const { yellow, dim } = require("colors/safe");

module.exports = function colorizePrice(price) {
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
};
