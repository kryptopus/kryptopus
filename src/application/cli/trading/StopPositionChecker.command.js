const AbstractCommand = require("@solfege/cli/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class StopPositionChecker extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:position_checker:stop");
    this.setDescription("Stop trading position checker");
  }

  async execute() {
    try {
      await pm2.connect();
      await pm2.stop("kryptopus-trading-position-checker");
    } catch (error) {
      console.error(error);
    }
    pm2.disconnect();
  }
};
