const fs = require("fs");
const path = require("path");
const AbstractCommand = require("@solfege/cli/AbstractCommand");
const convertIntervalToMilliseconds = require("../../../domain/util/convertIntervalToMilliseconds");
const StrategyEnvironment = require("../../../domain/trading/StrategyEnvironment");

module.exports = class StrategiesDaemon extends AbstractCommand {
  constructor(strategiesConfig) {
    super();

    this.strategiesConfig = strategiesConfig;

    this.setName("trading:strategies:daemon");
    this.setDescription("Trading strategies daemon");
  }

  async execute() {
    const strategies = new Map();
    for (const strategyName in this.strategiesConfig) {
      const config = this.strategiesConfig[strategyName];
      await fs.promises.access(path.resolve(config.filePath), fs.constants.R_OK);

      // eslint-disable-next-line
      const Strategy = require(config.filePath);
      const strategy = new Strategy();
      const environment = await this.buildStrategyEnvironment(strategyName, config);
      strategies.set(strategyName, {
        strategy,
        environment
      });
    }

    const delay = convertIntervalToMilliseconds("5m");
    const now = Date.now();
    const millisecondsToNextExecution = delay - (now % delay) + 1000;
    console.info(`Next execution at ${new Date(now + millisecondsToNextExecution)}`);

    await this.executeStrategies(strategies);
    setTimeout(async () => {
      await this.executeStrategies(strategies);
      setInterval(async () => {
        await this.executeStrategies(strategies);
      }, delay);
    }, millisecondsToNextExecution);
  }

  async executeStrategies(strategies) {
    for (const { strategy, environment } of strategies.values()) {
      environment.startExecutionAt(Date.now());
      await strategy.execute(environment);
      environment.endExecutionAt(Date.now());
    }
  }

  async buildStrategyEnvironment(name, config) {
    const parameters = { ...config.parameters };
    return new StrategyEnvironment(name, parameters);
  }
};
