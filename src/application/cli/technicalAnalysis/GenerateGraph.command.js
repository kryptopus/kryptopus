const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertDateStringToTimestamp = require("../../../util/date/convertDateStringToTimestamp");
const convertIntervalToMilliseconds = require("../../../domain/util/convertIntervalToMilliseconds");
const roundTimestampToInterval = require("../../../domain/util/roundTimestampToInterval");

module.exports = class GenerateGraph extends AbstractCommand {
  constructor(candlestickResolver) {
    super();

    this.candlestickResolver = candlestickResolver;

    this.setName("technicalAnalysis:graph:generate");
    this.setDescription("Generate graph");
    this.addArgument("exchange", "Exchange");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addArgument("interval", "Candlestick interval");
    this.addOption("--until <date>", "End date", "now");
    this.addOption("--type <type>", "Type", "candlestick");
  }

  async execute(exchangeName, baseSymbol, quoteSymbol, interval, options) {
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const endTimestamp = roundTimestampToInterval(convertDateStringToTimestamp(options.until), interval);
    const startTimestamp = endTimestamp - 100 * intervalMilliseconds;

    const candlesticks = await this.candlestickResolver.getCollection(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      interval,
      startTimestamp,
      endTimestamp
    );
  }
};
