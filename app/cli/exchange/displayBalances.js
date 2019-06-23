const asTable = require("as-table");
const { cyan, dim } = require("colors/safe");

module.exports = function displayBalances(balances) {
  const output = asTable.configure({
    title: x => cyan(x),
    dash: dim("─")
  })(balances);
  process.stdout.write(output);
  process.stdout.write("\n");
};
