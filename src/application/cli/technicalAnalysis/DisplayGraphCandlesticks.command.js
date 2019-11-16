const AbstractCommand = require("@solfege/cli/AbstractCommand");
const convertDateStringToTimestamp = require("../../../util/date/convertDateStringToTimestamp");
const convertIntervalToMilliseconds = require("../../../domain/util/convertIntervalToMilliseconds");
const roundTimestampToInterval = require("../../../domain/util/roundTimestampToInterval");
const CandlestickGraphDrawer = require("./graph/CandlestickGraphDrawer");

module.exports = class DisplayGraphCandlesticks extends AbstractCommand {
  constructor(candlestickResolver) {
    super();

    this.candlestickResolver = candlestickResolver;

    this.setName("technicalAnalysis:graph:candlestick:display");
    this.setDescription("Display graph with candlesticks");
    this.addArgument("exchange", "Exchange");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addArgument("interval", "Candlestick interval");
    this.addOption("--until <date>", "End date", "now");
  }

  async execute(exchangeName, baseSymbol, quoteSymbol, interval, options) {
    const ttyColumns = process.stdout.columns;
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const endTimestamp = roundTimestampToInterval(convertDateStringToTimestamp(options.until), interval);
    const startTimestamp = endTimestamp - ttyColumns * intervalMilliseconds;

    const candlesticks = await this.candlestickResolver.getCollection(
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
