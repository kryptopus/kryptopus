const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");

module.exports = class CollectCandlesticks extends AbstractCommand {
  constructor(candlestickCollector) {
    super();

    this.candlestickCollector = candlestickCollector;

    this.setName("exchange:candlestick:collect");
    this.setDescription("Collect candlesticks");
    this.addArgument("exchange", "Exchange");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addArgument("interval", "Candlestick interval");
    this.addArgument("periodStartAt", "Period start date");
    this.addArgument("periodEndAt", "Period end date");
  }

  async execute(exchangeName, baseSymbol, quoteSymbol, interval, periodStartAt, periodEndAt) {
    await this.candlestickCollector.collect(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      interval,
      periodStartAt,
      periodEndAt
    );
  }
};
