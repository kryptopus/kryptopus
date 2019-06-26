const displayBalances = require("../util/displayBalances");
const Balance = require("../../portfolio/Balance");

module.exports = class GetBalances {
  constructor(exchangeBuilder) {
    this.exchangeBuilder = exchangeBuilder;
  }

  getName() {
    return "portfolio:balances";
  }

  getDescription() {
    return "Get portfolio balances";
  }

  async execute() {
    const exchanges = this.exchangeBuilder.buildAll();

    const balances = [];
    for (const exchange of exchanges) {
      const exchangeBalances = await exchange.getBalances();
      for (const exchangeBalance of exchangeBalances) {
        balances.push(new Balance(exchange.getName(), exchangeBalance.asset, exchangeBalance.total));
      }
    }

    displayBalances(balances);
  }
};
