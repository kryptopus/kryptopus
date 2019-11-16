const AbstractCommand = require("@solfege/cli/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class StopCollectorDaemon extends AbstractCommand {
  constructor() {
    super();

    this.setName("technicalAnalysis:collector:stop");
    this.setDescription("Stop collector daemon");
  }

  async execute() {
    try {
      await pm2.connect();
      await pm2.stop("kryptopus-candlestick-collector");
    } catch (error) {
      console.error(error);
    }
    pm2.disconnect();
  }
};
