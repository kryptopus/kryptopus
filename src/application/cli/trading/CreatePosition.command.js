const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");

module.exports = class CreatePosition extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:position:create");
    this.setDescription("Create trade position");
    this.addArgument("entry", "Entry tactic");
    this.addArgument("entryParameters", "Entry parameters");
    this.addArgument("exit", "Exit tactic");
    this.addArgument("exitParameters", "Exit parameters");
  }

  execute(entryName, entryParameters, exitName, exitParameters) {
    console.info(entryName, entryParameters, exitName, exitParameters);
  }
};
