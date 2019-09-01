const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");
const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertIntervalToMilliseconds = require("../../../domain/util/convertIntervalToMilliseconds");
const roundTimestampToInterval = require("../../../domain/util/roundTimestampToInterval");
const assertKnownInterval = require("../../../domain/util/assertKnownInterval");
const StrategyEnvironment = require("../../../domain/trading/StrategyEnvironment");

module.exports = class BacktestStrategy extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:strategy:backtest");
    this.setDescription("Backtest trading strategy");
    this.addArgument("interval", "Interval");
    this.addArgument("strategy", "Strategy file path");
  }

  async execute(interval, strategyFilePath) {
    assertKnownInterval(interval);

    const strategy = await this.newStrategy(strategyFilePath);

    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const startTimestamp = roundTimestampToInterval(Date.now() - 1000 * 60 * 60 * 24 * 365, interval);
    const endTimestamp = roundTimestampToInterval(Date.now(), interval);
    const executionCount = Math.floor((endTimestamp - startTimestamp) / intervalMilliseconds);

    console.info("Back test from", format(startTimestamp, "YYYY-MM-DD"), "to", format(endTimestamp, "YYYY-MM-DD"));
    console.info("Execution count:", executionCount);

    let executionIndex = 0;
    for (let timestamp = startTimestamp; timestamp < endTimestamp; timestamp += intervalMilliseconds) {
      const environment = await this.buildStrategyEnvironment(timestamp, interval);

      executionIndex++;
      process.stdout.write(
        `[${String(executionIndex).padStart(String(executionCount).length, " ")}/${executionCount}] `
      );
      strategy.execute(environment);
    }
  }

  getAbsolutePath(filePath) {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }

    return path.resolve(process.cwd(), filePath);
  }

  async newStrategy(filePath) {
    const absoluteStrategyFilePath = this.getAbsolutePath(filePath);
    await fs.promises.access(absoluteStrategyFilePath, fs.constants.R_OK);
    // eslint-disable-next-line
    const Strategy = require(absoluteStrategyFilePath);
    return new Strategy();
  }

  async buildStrategyEnvironment(timestamp, interval) {
    const parameters = {};
    return new StrategyEnvironment("backtest", timestamp, interval, parameters);
  }
};
