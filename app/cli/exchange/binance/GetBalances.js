const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const Binance = require("../../../exchange/binance/Binance");

module.exports = class GetBalances extends AbstractCommand {
  constructor(accounts) {
    super();

    this.accounts = accounts;

    this.setName("exchange:binance:balances");
    this.setDescription("Get Binance balances");
    this.addArgument("accountName", "Account name");
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
