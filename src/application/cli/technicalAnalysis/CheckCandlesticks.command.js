const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertDateStringToTimestamp = require("../../../util/date/convertDateStringToTimestamp");

module.exports = class CheckCandlesticks extends AbstractCommand {
  constructor() {
    super();

    this.setName("technicalAnalysis:candlestick:check");
    this.setDescription("Check collected candlesticks");
    this.addArgument("exchange", "Exchange");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addArgument("interval", "Candlestick interval");
    this.addArgument("periodStartAt", "Period start date");
    this.addArgument("periodEndAt", "Period end date");
  }

  async execute(exchangeName, baseSymbol, quoteSymbol, interval, periodStartAt, periodEndAt) {
    const periodStartTimestamp = convertDateStringToTimestamp(periodStartAt);
    const periodEndTimestamp = convertDateStringToTimestamp(periodEndAt);
  }
};
