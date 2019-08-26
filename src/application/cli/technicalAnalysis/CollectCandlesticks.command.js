const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertDateStringToTimestamp = require("../../../util/date/convertDateStringToTimestamp");
const sleep = require("../../../util/sleep");

module.exports = class CollectCandlesticks extends AbstractCommand {
  constructor(candlestickCollector) {
    super();

    this.candlestickCollector = candlestickCollector;

    this.setName("technicalAnalysis:candlestick:collect");
    this.setDescription("Collect candlesticks");
    this.addArgument("exchange", "Exchange");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addArgument("interval", "Candlestick interval");
    this.addArgument("periodStartAt", "Period start date");
    this.addArgument("periodEndAt", "Period end date");
  }

  async execute(exchangeName, baseSymbol, quoteSymbol, interval, periodStartAt, periodEndAt) {
    const periodEndTimestamp = convertDateStringToTimestamp(periodEndAt);
    let nextPeriodStartTimestamp = convertDateStringToTimestamp(periodStartAt);
    let candlesticks = [];

    do {
      console.log("Collecting period:", new Date(nextPeriodStartTimestamp), "-", new Date(periodEndTimestamp));
      candlesticks = await this.candlestickCollector.collect(
        exchangeName,
        baseSymbol,
        quoteSymbol,
        interval,
        nextPeriodStartTimestamp,
        periodEndTimestamp
      );
      console.log("Collected candlesticks:", candlesticks.length);

      if (candlesticks.length > 0) {
        nextPeriodStartTimestamp = candlesticks.pop().closeTimestamp + 1;
        await sleep(1000 * 5);
      }
    } while (candlesticks.length > 0);
  }
};
