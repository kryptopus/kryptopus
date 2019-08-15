const BigNumber = require("bignumber.js");
const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const Cryptocompare = require("../../../../domain/aggregator/Cryptocompare");

module.exports = class GetAssetPrice extends AbstractCommand {
  constructor(apiKey) {
    super();

    this.apiKey = apiKey;

    this.setName("aggregator:cryptocompare:asset_price");
    this.setDescription("Get asset price");
    this.addArgument("base", "Base symbol");
    this.addArgument("quote", "Quote symbol");
  }

  async execute(base, quote) {
    const cryptocompare = new Cryptocompare(this.apiKey);
    const prices = await cryptocompare.getSingleAssetPrice(base, quote);

    Object.entries(prices).forEach(entry => {
      const price = new BigNumber(entry[1]);
      console.info(`1 ${base} = ${price.toFixed(price.dp())} ${quote}`);
    });
  }
};
