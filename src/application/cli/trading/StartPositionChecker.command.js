const AbstractCommand = require("@solfege/cli/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class StartPositionChecker extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:position_checker:start");
    this.setDescription("Start trading position checker");
  }

  async execute() {
    const cliPath = process.argv[1];

    try {
      await pm2.connect();
      const proc = await pm2.start({
        name: "kryptopus-trading-position-checker",
        script: cliPath,
        args: ["trading:position_checker:daemon"]
      });
      if (proc[0].status !== "online") {
        console.error("Fail to start position checker");
      } else {
        console.info("Position checker started");
      }
    } catch (error) {
      console.error(error);
    }
    pm2.disconnect();
  }
};
