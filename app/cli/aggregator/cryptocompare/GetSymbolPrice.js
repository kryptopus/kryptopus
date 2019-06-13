const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const Cryptocompare = require("../../../aggregator/Cryptocompare");

module.exports = class GetSymbolPrice extends AbstractCommand {
  constructor(apiKey) {
    super();

    this.apiKey = apiKey;

    this.setName("aggregator:cryptocompare:symbol_price");
    this.setDescription("Get symbol price");
    this.addArgument("base", "Base symbol");
    this.addArgument("quote", "Quote symbol");
  }

  async execute(base, quote) {
    const cryptocompare = new Cryptocompare(this.apiKey);
    const prices = await cryptocompare.getSingleSymbolPrice(base, [quote]);

    Object.entries(prices).forEach(entry => {
      console.info(entry[0], entry[1]);
    });
  }
};
