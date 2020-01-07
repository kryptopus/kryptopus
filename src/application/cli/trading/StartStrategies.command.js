const AbstractCommand = require("@solfege/cli/AbstractCommand");
const pm2 = require("../../../util/pm2");

module.exports = class StartStrategies extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:strategies:start");
    this.setDescription("Start strategies");
  }

  async execute() {
    const cliPath = process.argv[1];

    try {
      await pm2.connect();
      const proc = await pm2.start({
        name: "kryptopus-trading-strategies",
        script: cliPath,
        args: ["trading:strategies:daemon"]
      });
      if (proc[0].status !== "online") {
        console.error("Fail to start trading strategies");
      } else {
        console.info("Trading strategies started");
      }
    } catch (error) {
      console.error(error);
    }
    pm2.disconnect();
  }
};
