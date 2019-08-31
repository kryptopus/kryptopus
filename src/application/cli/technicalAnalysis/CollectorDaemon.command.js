const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertIntervalToMilliseconds = require("../../../domain/util/convertIntervalToMilliseconds");
const roundTimestampToInterval = require("../../../domain/util/roundTimestampToInterval");

module.exports = class CollectorDaemon extends AbstractCommand {
  constructor(symbolPairsByExchange, collector) {
    super();

    this.symbolPairsByExchange = symbolPairsByExchange;
    this.collector = collector;

    this.setName("technicalAnalysis:collector:daemon");
    this.setDescription("Collector daemon");
  }

  async execute() {
    const delay = convertIntervalToMilliseconds("5m");
    const now = Date.now();
    const millisecondsToNextExecution = delay - (now % delay) + 1000;
    console.info(`Next execution at ${new Date(now + millisecondsToNextExecution)}`);

    setTimeout(async () => {
      await this.collect();
      setInterval(async () => {
        await this.collect();
      }, delay);
    }, millisecondsToNextExecution);
  }

  async collect() {
    const interval = "5m";
    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const startTimestamp = roundTimestampToInterval(Date.now() - intervalMilliseconds * 500, interval);
    const endTimestamp = roundTimestampToInterval(Date.now(), interval) - intervalMilliseconds;
    const startDateString = new Date(startTimestamp).toISOString();
    const endDateString = new Date(endTimestamp).toISOString();

    console.info(new Date(), `Start collecting [${startDateString}] to [${endDateString}] …`);

    let total = 0;
    for (const exchangeName in this.symbolPairsByExchange) {
      const symbolPairs = this.symbolPairsByExchange[exchangeName];
      for (const symbolPair of symbolPairs) {
        const [baseSymbol, quoteSymbol] = symbolPair;
        const candlesticks = await this.collector.collect(
          exchangeName,
          baseSymbol,
          quoteSymbol,
          interval,
          startTimestamp,
          endTimestamp
        );
        total += candlesticks.length;
      }
    }
    console.info(new Date(), `${total} collected candlesticks`);
  }
};
