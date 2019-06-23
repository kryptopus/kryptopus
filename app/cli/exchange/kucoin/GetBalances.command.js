const Kucoin = require("../../../exchange/kucoin/Kucoin");
const displayBalances = require("../displayBalances");

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
    const { apiKey, apiSecret, apiPassphrase } = this.accounts[accountName];
    const kucoin = new Kucoin(apiKey, apiSecret, apiPassphrase);
    const balances = await kucoin.getBalances();

    displayBalances(balances);
  }
};
