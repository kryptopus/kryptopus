const AbstractCommand = require("@solfege/cli/AbstractCommand");
const displayBalances = require("../../util/displayBalances");

module.exports = class GetBalances extends AbstractCommand {
  constructor(exchangeBuilder) {
    super();

    this.exchangeBuilder = exchangeBuilder;

    this.setName("exchange:binance:balances");
    this.setDescription("Get Binance balances");
    this.addArgument("accountName", "Account name");
  }

  async execute(accountName) {
    const binance = this.exchangeBuilder.buildAccount(accountName);
    const balances = await binance.getBalances();

    displayBalances(balances);
  }
};
