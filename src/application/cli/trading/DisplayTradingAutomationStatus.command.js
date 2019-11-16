const AbstractCommand = require("@solfege/cli/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class DisplayTradingAutomationStatus extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:automation:status");
    this.setDescription("Display trading automation status");
  }

  async execute() {
    try {
      await pm2.connect();
      const app = await pm2.getAppByName("kryptopus-trading-automation");
      console.log(app.pm2_env.status);
    } catch (error) {
      console.log("Daemon not found");
    }
    pm2.disconnect();
  }
};
