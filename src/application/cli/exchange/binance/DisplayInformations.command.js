const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");

module.exports = class DisplayInformations extends AbstractCommand {
  constructor(exchangeBuilder) {
    super();

    this.exchangeBuilder = exchangeBuilder;

    this.setName("exchange:binance:informations");
    this.setDescription("Display Binance informations");
  }

  async execute() {
    const binance = this.exchangeBuilder.build("binance");
    const informations = await binance.getInformations();
    console.info(informations);
  }
};
