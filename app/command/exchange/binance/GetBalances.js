const Binance = require("../../../exchange/binance/Binance");

module.exports = class GetBalances {
  constructor(accounts) {
    this.accounts = accounts;
  }

  getName() {
    return "exchange:binance:balances";
  }

  getDescription() {
    return "Get Binance balances";
  }

  setContainer(container) {
    this.container = container;
  }

  async execute(accountName) {
    const { apiKey, apiSecret } = this.accounts[accountName];
    const binance = new Binance(apiKey, apiSecret);
    const balances = await binance.getBalances();

    balances.forEach(balance => {
      const quantity = Number(balance.free) + Number(balance.locked);
      if (quantity <= 0) {
        return;
      }
      console.info(balance.asset, quantity);
    });
  }
};
