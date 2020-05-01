const AbstractCommand = require("@solfege/cli/AbstractCommand");
const sleep = require("../../../util/sleep");

module.exports = class PositionCheckerDaemon extends AbstractCommand {
  constructor(positionRegistry) {
    super();

    this.positionRegistry = positionRegistry;

    this.setName("trading:position_checker:daemon");
    this.setDescription("Position checker daemon");
  }

  async execute() {
    console.info("Start position checker daemon");

    do {
      await this.checkPositions();
      await sleep(60000);
    } while (true);
  }

  async checkPositions() {
    const positions = await this.positionRegistry.getOpenPositions();
    console.log(positions);
  }
};
