const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");

module.exports = class CollectorDaemon extends AbstractCommand {
  constructor(symbolPairsByExchange, collector) {
    super();

    this.symbolPairsByExchange = symbolPairsByExchange;
    this.collector = collector;

    this.setName("technicalAnalysis:collector:daemon");
    this.setDescription("Collector daemon");
  }

  async execute() {
    const delay = 1000 * 60 * 5;
    const now = Date.now();
    const millesecondsToNextExecution = delay - (now % delay);
    console.info(`Next execution at ${new Date(now + millesecondsToNextExecution)}`);

    setTimeout(async () => {
      await this.collect();
      setInterval(async () => {
        await this.collect();
      }, delay);
    }, millesecondsToNextExecution);
  }

  async collect() {
    console.info(new Date(), "Start collecting ...");
    let total = 0;
    for (const exchangeName in this.symbolPairsByExchange) {
      const symbolPairs = this.symbolPairsByExchange[exchangeName];
      for (const symbolPair of symbolPairs) {
        const [baseSymbol, quoteSymbol] = symbolPair;
        const candlesticks = await this.collector.collect(
          exchangeName,
          baseSymbol,
          quoteSymbol,
          "5m",
          Date.now() - 1000 * 60 * 60,
          Date.now()
        );
        total += candlesticks.length;
      }
    }
    console.info(new Date(), `${total} collected candlesticks`);
  }
};
