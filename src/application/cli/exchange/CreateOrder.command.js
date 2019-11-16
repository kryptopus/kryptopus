const AbstractCommand = require("@solfege/cli/AbstractCommand");

module.exports = class CreateOrder extends AbstractCommand {
  constructor(exchangeBuilder) {
    super();

    this.exchangeBuilder = exchangeBuilder;

    this.setName("exchange:order:create");
    this.setDescription("Create order");
    this.addArgument("accountName", "Account name");
    this.addArgument("side", "BUY or SELL");
    this.addArgument("type", "LIMIT or MARKET");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addOption("--baseQuantity <quantity>", "Base quantity");
    this.addOption("--price <price>", "Target price");
  }

  async execute(accountName) {
    const account = this.exchangeBuilder.buildAccount(accountName);
    console.log(account);
  }
};
