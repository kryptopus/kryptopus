const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class StartCollectorDaemon extends AbstractCommand {
  constructor() {
    super();

    this.setName("technicalAnalysis:collector:start");
    this.setDescription("Start collector daemon");
  }

  async execute() {
    const cliPath = process.argv[1];

    try {
      await pm2.connect();
      const proc = await pm2.start({
        name: "kryptopus-candlestick-collector",
        script: cliPath,
        args: ["technicalAnalysis:collector:daemon"]
      });
      if (proc[0].status !== "online") {
        console.error("Fail to start collector daemon");
      } else {
        console.info("Collector daemon started");
      }
    } catch (error) {
      console.error(error);
    }
    pm2.disconnect();
  }
};
