const buildExchange = require("../../exchange/buildExchange");
const displayBalances = require("../exchange/displayBalances");

module.exports = class GetBalances {
  constructor(exchangeAccounts) {
    this.exchangeAccounts = exchangeAccounts;
  }

  getName() {
    return "portfolio:balances";
  }

  getDescription() {
    return "Get portfolio balances";
  }

  async execute() {
    const balances = [];
    for (const accountName in this.exchangeAccounts) {
      const account = this.exchangeAccounts[accountName];
      const exchange = buildExchange(account);
      const exchangeBalances = await exchange.getBalances();
      balances.push(...exchangeBalances);
    }

    displayBalances(balances);
  }
};
