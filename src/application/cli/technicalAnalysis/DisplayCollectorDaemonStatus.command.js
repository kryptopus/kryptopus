const AbstractCommand = require("@solfege/cli/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class DisplayCollectorDaemonStatus extends AbstractCommand {
  constructor() {
    super();

    this.setName("technicalAnalysis:collector:status");
    this.setDescription("Display collector status");
  }

  async execute() {
    try {
      await pm2.connect();
      const app = await pm2.getAppByName("kryptopus-candlestick-collector");
      console.log(app.pm2_env.status);
    } catch (error) {
      console.log("Daemon not found");
    }
    pm2.disconnect();
  }
};
