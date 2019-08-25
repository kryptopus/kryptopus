const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");

module.exports = class Daemon extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:automation:daemon");
    this.setDescription("Trading automation daemon");
  }

  async execute() {
    setInterval(() => {
      console.log("daemon");
    }, 1000);
  }
};
