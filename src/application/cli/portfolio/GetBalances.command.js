const displayBalances = require("../util/displayBalances");
const Balance = require("../../../domain/portfolio/Balance");

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
    const accounts = this.exchangeBuilder.buildAccounts();

    const balances = [];
    for (const account of accounts) {
      const accountBalances = await account.getBalances();
      for (const accountBalance of accountBalances) {
        balances.push(new Balance(account.getName(), accountBalance.symbol, accountBalance.total));
      }
    }

    displayBalances(balances);
  }
};
