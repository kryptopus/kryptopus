const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const pm2 = require("../../util/pm2");

module.exports = class StopTradingAutomation extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:automation:stop");
    this.setDescription("Stop trading automation");
  }

  async execute() {
    try {
      await pm2.connect();
      await pm2.stop("kryptopus-trading-automation");
    } catch (error) {
      console.error(error);
    }
    pm2.disconnect();
  }
};
