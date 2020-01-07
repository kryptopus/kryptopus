const AbstractCommand = require("@solfege/cli/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class DisplayStrategiesStatus extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:strategies:status");
    this.setDescription("Display trading strategies status");
  }

  async execute() {
    try {
      await pm2.connect();
      const app = await pm2.getAppByName("kryptopus-trading-strategies");
      console.log(app.pm2_env.status);
    } catch (error) {
      console.log("Daemon not found");
    }
    pm2.disconnect();
  }
};
