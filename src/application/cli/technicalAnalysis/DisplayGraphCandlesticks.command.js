const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertDateStringToTimestamp = require("../../../util/date/convertDateStringToTimestamp");
const convertIntervalToMilliseconds = require("../../../domain/util/convertIntervalToMilliseconds");
const CandlestickGraphDrawer = require("./graph/CandlestickGraphDrawer");

module.exports = class DisplayGraphCandlesticks extends AbstractCommand {
  constructor(candlestickRepository) {
    super();

    this.candlestickRepository = candlestickRepository;

    this.setName("technicalAnalysis:graph:candlestick:display");
    this.setDescription("Display graph with candlesticks");
    this.addArgument("exchange", "Exchange");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addArgument("interval", "Candlestick interval");
    this.addArgument("until", "End date");
  }

  async execute(exchangeName, baseSymbol, quoteSymbol, interval, until) {
    const ttyColumns = process.stdout.columns;
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const endTimestamp = convertDateStringToTimestamp(until);
    const startTimestamp = endTimestamp - ttyColumns * intervalMilliseconds;

    const candlesticks = await this.candlestickRepository.getCollection(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      interval,
      startTimestamp,
      endTimestamp
    );
    const drawer = new CandlestickGraphDrawer();
    drawer.draw(candlesticks);
  }
};
