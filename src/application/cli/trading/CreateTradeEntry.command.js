const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");

module.exports = class CreateTradeEntry extends AbstractCommand {
  constructor() {
    super();

    this.setName("trading:entry:create");
    this.setDescription("Create trade entry");
  }

  execute() {}
};
