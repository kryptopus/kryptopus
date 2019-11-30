const AbstractCommand = require("@solfege/cli/AbstractCommand");

module.exports = class DisplayOpenPositions extends AbstractCommand {
  constructor(positionRegistry) {
    super();

    this.positionRegistry = positionRegistry;

    this.setName("trading:positions:open:display");
    this.setDescription("Display open positions");
  }

  async execute() {
    const positions = await this.positionRegistry.getOpenPositions();
    console.log(positions);
  }
};
