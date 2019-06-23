const asTable = require("as-table");
const { cyan, dim } = require("colors/safe");
const formatPrice = require("../formatPrice");

module.exports = function displayBalances(balances) {
  const priceTitles = ["total", "inOrder", "available"];
  const output = asTable.configure({
    title: x => cyan(x),
    dash: dim("─"),
    print: (value, title) => {
      if (priceTitles.includes(title)) {
        return formatPrice(value);
      }
      return String(value);
    }
  })(balances);
  process.stdout.write(output);
  process.stdout.write("\n");
};
