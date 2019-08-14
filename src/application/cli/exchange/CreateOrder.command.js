const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");

module.exports = class CreateOrder extends AbstractCommand {
  constructor(exchangeBuilder) {
    super();

    this.exchangeBuilder = exchangeBuilder;

    this.setName("exchange:order:create");
    this.setDescription("Create order");
    this.addArgument("accountName", "Account name");
  }

  async execute(accountName) {
    const account = this.exchangeBuilder.build(accountName);
    console.log(account);
  }
};
