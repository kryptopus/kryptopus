const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertDateStringToTimestamp = require("../../../util/date/convertDateStringToTimestamp");

module.exports = class DisplayCandlesticks extends AbstractCommand {
  constructor(candlestickRepository) {
    super();

    this.candlestickRepository = candlestickRepository;

    this.setName("technicalAnalysis:candlestick:display");
    this.setDescription("Display candlesticks");
    this.addArgument("exchange", "Exchange");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addArgument("interval", "Candlestick interval");
    this.addArgument("periodStartAt", "Period start date");
    this.addArgument("periodEndAt", "Period end date");
  }

  async execute(exchangeName, baseSymbol, quoteSymbol, interval, periodStartAt, periodEndAt) {
    const candlesticks = await this.candlestickRepository.getCollection(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      interval,
      convertDateStringToTimestamp(periodStartAt),
      convertDateStringToTimestamp(periodEndAt)
    );
    console.log(candlesticks);
  }
};
