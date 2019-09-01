const { green, red, cyan, yellow } = require("colors/safe");
const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertDateStringToTimestamp = require("../../../util/date/convertDateStringToTimestamp");
const convertIntervalToMilliseconds = require("../../../domain/util/convertIntervalToMilliseconds");

module.exports = class CheckCandlesticks extends AbstractCommand {
  constructor(repository) {
    super();

    this.repository = repository;

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
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const startTimestamp = convertDateStringToTimestamp(periodStartAt);
    const endTimestamp = convertDateStringToTimestamp(periodEndAt);
    const endDate = new Date(endTimestamp);

    const currentDate = new Date(startTimestamp);
    do {
      const monthLabel = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, "0")}`;

      const monthStartDate = new Date(currentDate.getTime());
      monthStartDate.setUTCDate(1);
      monthStartDate.setUTCHours(0);
      monthStartDate.setUTCMinutes(0);
      monthStartDate.setUTCSeconds(0);
      monthStartDate.setUTCMilliseconds(0);
      const monthStartTimestamp = monthStartDate.getTime();
      const monthEndDate = new Date(monthStartTimestamp);
      monthEndDate.setUTCMonth(monthEndDate.getUTCMonth() + 1);
      monthEndDate.setUTCMilliseconds(-1);
      const monthEndTimestamp = monthEndDate.getTime();

      const requestedStartTimestamp = monthStartTimestamp < startTimestamp ? startTimestamp : monthStartTimestamp;
      const requestedEndTimestamp = monthEndTimestamp > endTimestamp ? endTimestamp : monthEndTimestamp;

      const candlesticks = await this.repository.getCollection(
        exchangeName,
        baseSymbol,
        quoteSymbol,
        interval,
        requestedStartTimestamp,
        requestedEndTimestamp
      );
      const expectedCandlestickCount = Math.ceil(
        (requestedEndTimestamp - requestedStartTimestamp) / intervalMilliseconds
      );

      if (candlesticks.length === expectedCandlestickCount) {
        console.info(monthLabel, ":", green("OK"));
      } else {
        console.error(
          monthLabel,
          ":",
          red("INCOMPLETE"),
          "",
          cyan(String(candlesticks.length).padStart(5, " ")),
          "instead of",
          yellow(expectedCandlestickCount)
        );
      }
      currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    } while (currentDate < endDate);
  }
};
