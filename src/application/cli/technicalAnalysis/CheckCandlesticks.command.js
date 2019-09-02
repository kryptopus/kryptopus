const { green, red } = require("colors/safe");
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

      const { unknownCandlesticks, missingCandlesticks, checkedCandlesticks } = this.splitCandlesticksByExpectation(
        candlesticks,
        requestedStartTimestamp,
        requestedEndTimestamp,
        interval
      );
      if (unknownCandlesticks.length === 0 && missingCandlesticks.length === 0) {
        console.info(monthLabel, ":", green("OK"));
      } else {
        let status = "ERROR";
        if (unknownCandlesticks.length > 0) {
          status = "TOO MUCH CANDLESTICKS";
        } else if (missingCandlesticks.length > 0) {
          status = "INCOMPLETE";
        }
        console.error(monthLabel, ":", red(status));
        console.error("         ", "Checked candlesticks:", checkedCandlesticks.length, "/", expectedCandlestickCount);
        console.error("         ", "Unknown candlesticks:", unknownCandlesticks.length);
        console.error("         ", "Missing candlesticks:", missingCandlesticks.length);
        if (unknownCandlesticks.length > 0) {
          const firstUnknownCandlestick = unknownCandlesticks[0];
          console.error("         ", "Sample unknown candlestick:", firstUnknownCandlestick);
        }
      }

      currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    } while (currentDate < endDate);
  }

  splitCandlesticksByExpectation(candlesticks, startTimestamp, endTimestamp, interval) {
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);

    const candlestickStatuses = {};
    for (let timestamp = startTimestamp; timestamp <= endTimestamp; timestamp += intervalMilliseconds) {
      candlestickStatuses[timestamp] = false;
    }

    const checkedCandlesticks = [];
    const unknownCandlesticks = [];
    const missingCandlesticks = [];
    for (const candlestick of candlesticks) {
      if (candlestickStatuses[candlestick.openTimestamp] === undefined) {
        unknownCandlesticks.push(candlestick);
        continue;
      }

      if (candlestick.closeTimestamp !== candlestick.openTimestamp + intervalMilliseconds - 1) {
        unknownCandlesticks.push(candlestick);
        continue;
      }

      candlestickStatuses[candlestick.openTimestamp] = true;
      checkedCandlesticks.push(candlesticks);
    }

    for (const timestamp in candlestickStatuses) {
      if (!candlestickStatuses[timestamp]) {
        missingCandlesticks.push(timestamp);
      }
    }

    return { unknownCandlesticks, checkedCandlesticks, missingCandlesticks };
  }
};
