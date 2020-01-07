const AbstractCommand = require("@solfege/cli/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class StopStrategies extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:strategies:stop");
    this.setDescription("Stop trading strategies");
  }

  async execute() {
    try {
      await pm2.connect();
      await pm2.stop("kryptopus-trading-strategies");
    } catch (error) {
      console.error(error);
    }
    pm2.disconnect();
  }
};
