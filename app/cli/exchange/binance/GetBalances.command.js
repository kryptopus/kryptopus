const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const buildExchange = require("../../../exchange/buildExchange");
const displayBalances = require("../displayBalances");

module.exports = class GetBalances extends AbstractCommand {
  constructor(accounts) {
    super();

    this.accounts = accounts;

    this.setName("exchange:binance:balances");
    this.setDescription("Get Binance balances");
    this.addArgument("accountName", "Account name");
  }

  async execute(accountName) {
    const binance = buildExchange(this.accounts[accountName]);
    const balances = await binance.getBalances();

    displayBalances(balances);
  }
};
