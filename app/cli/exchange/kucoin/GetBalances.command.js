const buildExchange = require("../../../exchange/buildExchange");
const displayBalances = require("../../util/displayBalances");

module.exports = class GetBalances {
  constructor(accounts) {
    this.accounts = accounts;
  }

  getName() {
    return "exchange:kucoin:balances";
  }

  getDescription() {
    return "Get Kucoin balances";
  }

  getArguments() {
    return [{ name: "accountName", description: "Account name" }];
  }

  async execute(accountName) {
    const kucoin = buildExchange(this.accounts[accountName]);
    const balances = await kucoin.getBalances();

    displayBalances(balances);
  }
};
