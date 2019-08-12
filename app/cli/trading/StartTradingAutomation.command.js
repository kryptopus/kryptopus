const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");
const pm2 = require("../../util/pm2");

module.exports = class StartTradingAutomation extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:automation:start");
    this.setDescription("Start trading automation");
  }

  async execute() {
    const cliPath = process.argv[1];

    try {
      await pm2.connect();
      const proc = await pm2.start({
        name: "kryptopus-trading-automation",
        script: cliPath,
        args: ["trading:automation:daemon"]
      });
      if (proc[0].status !== "online") {
        console.error("Fail to start trading automation");
      } else {
        console.info("Trading automation started");
      }
    } catch (error) {
      console.error(error);
    }
    pm2.disconnect();
  }
};
