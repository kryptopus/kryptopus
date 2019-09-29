const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");
const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const convertIntervalToMilliseconds = require("../../../domain/util/convertIntervalToMilliseconds");
const roundTimestampToInterval = require("../../../domain/util/roundTimestampToInterval");
const assertKnownInterval = require("../../../domain/util/assertKnownInterval");
const StrategyEnvironment = require("../../../domain/trading/StrategyEnvironment");
const ServiceRegistry = require("../../../domain/trading/ServiceRegistry");

module.exports = class BacktestStrategy extends AbstractCommand {
  constructor(serviceRegistry, orderResolver, orderService, positionService) {
    super();

    this.serviceRegistry = serviceRegistry;
    this.orderResolver = orderResolver;
    this.orderService = orderService;
    this.positionService = positionService;

    this.setName("trading:strategy:backtest");
    this.setDescription("Backtest trading strategy");
    this.addArgument("interval", "Interval");
    this.addArgument("strategy", "Strategy file path");
  }

  async execute(interval, strategyFilePath) {
    assertKnownInterval(interval);

    const strategy = await this.buildStrategy(strategyFilePath);

    const intervalMilliseconds = convertIntervalToMilliseconds(interval);
    const startTimestamp = roundTimestampToInterval(Date.now() - 1000 * 60 * 60 * 24 * 365, interval);
    // const startTimestamp = roundTimestampToInterval(Date.now() - 1000 * 60 * 60 * 24 * 30, interval);
    const endTimestamp = roundTimestampToInterval(Date.now(), interval);
    const executionCount = Math.floor((endTimestamp - startTimestamp) / intervalMilliseconds);

    console.info("Back test from", format(startTimestamp, "YYYY-MM-DD"), "to", format(endTimestamp, "YYYY-MM-DD"));
    console.info("Execution count:", executionCount);

    let executionIndex = 0;
    for (let timestamp = startTimestamp; timestamp < endTimestamp; timestamp += intervalMilliseconds) {
      await this.orderResolver.resolveAtTimestamp(timestamp);

      const environment = await this.buildStrategyEnvironment(timestamp, interval);

      executionIndex++;
      process.stdout.write(
        `[${String(executionIndex).padStart(String(executionCount).length, " ")}/${executionCount}] ${format(
          environment.currentTimestamp,
          "YYYY-MM-DD HH:mm"
        )} | `
      );
      await strategy.execute(environment);
      await this.saveStrategyEnvironment(environment);

      process.stdout.write(await this.getBalanceOutput(environment));
      process.stdout.write(`\n`);
    }
  }

  getAbsolutePath(filePath) {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }

    return path.resolve(process.cwd(), filePath);
  }

  async buildStrategy(filePath) {
    const absoluteStrategyFilePath = this.getAbsolutePath(filePath);
    await fs.promises.access(absoluteStrategyFilePath, fs.constants.R_OK);
    // eslint-disable-next-line
    const Strategy = require(absoluteStrategyFilePath);
    return new Strategy();
  }

  buildBacktestServiceRegistry() {
    const backtestServiceRegistry = new ServiceRegistry();
    for (const [id, service] of this.serviceRegistry) {
      if (id === "order") {
        backtestServiceRegistry.set(id, this.orderService);
        continue;
      }
      if (id === "position") {
        backtestServiceRegistry.set(id, this.positionService);
        continue;
      }
      backtestServiceRegistry.set(id, service);
    }
    return backtestServiceRegistry;
  }

  async buildStrategyEnvironment(timestamp, interval) {
    const parameters = {};
    const serviceRegistry = this.buildBacktestServiceRegistry();
    const environment = new StrategyEnvironment("backtest", timestamp, interval, parameters, serviceRegistry);

    if (this.savedEnvironment) {
      environment.orderIds = this.savedEnvironment.orderIds;
    }

    return environment;
  }

  async saveStrategyEnvironment(environment) {
    this.savedEnvironment = environment;
  }

  async getBalanceOutput(environment) {
    const orders = await environment.getOrders();
    const balances = {};
    for (const order of orders) {
      if (!order.isFilled()) {
        continue;
      }

      const { baseSymbol, quoteSymbol, baseQuantity, quoteQuantity } = order;
      if (!Object.prototype.hasOwnProperty.call(balances, baseSymbol)) {
        balances[baseSymbol] = 0;
      }

      if (!Object.prototype.hasOwnProperty.call(balances, quoteSymbol)) {
        balances[quoteSymbol] = 0;
      }

      if (order.isBuying()) {
        balances[baseSymbol] -= baseQuantity;
        balances[quoteSymbol] += quoteQuantity;
      } else {
        balances[baseSymbol] += baseQuantity;
        balances[quoteSymbol] -= quoteQuantity;
      }
    }

    const outputArray = [];
    for (const symbol in balances) {
      outputArray.push(`${balances[symbol]} ${symbol}`);
    }
    return outputArray.join(", ");
  }
};
