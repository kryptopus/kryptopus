const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const Binance = require("../../../exchange/binance/Binance");

module.exports = class GetOpenOrders extends AbstractCommand {
  constructor(accounts) {
    super();

    this.accounts = accounts;

    this.setName("exchange:binance:open_orders");
    this.setDescription("Get Binance open orders");
    this.addArgument("accountName", "Account name");
  }

  async execute(accountName) {
    const { apiKey, apiSecret } = this.accounts[accountName];
    const binance = new Binance(apiKey, apiSecret);
    const orders = await binance.getOpenOrders();

    orders.forEach(order => {
      console.info(order);
    });
  }
};
