const displayBalances = require("../../util/displayBalances");

module.exports = class GetBalances {
  constructor(exchangeBuilder) {
    this.exchangeBuilder = exchangeBuilder;
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
    const kucoin = this.exchangeBuilder.build(accountName);
    const balances = await kucoin.getBalances();

    displayBalances(balances);
  }
};
