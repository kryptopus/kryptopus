const AbstractCommand = require("@solfege/cli/AbstractCommand");

module.exports = class CreatePosition extends AbstractCommand {
  constructor(exchangeBuilder, tradingServices) {
    super();

    this.exchangeBuilder = exchangeBuilder;
    this.tradingServices = tradingServices;

    this.setName("trading:position:create");
    this.setDescription("Create trade position");
    this.addArgument("accountName", "Account name");
    this.addArgument("entry", "Entry tactic");
    this.addArgument("entryParameters", "Entry parameters");
    this.addArgument("exit", "Exit tactic");
    this.addArgument("exitParameters", "Exit parameters");
  }

  async execute(accountName, entryName, entryParameters, exitName, exitParameters) {
    const account = this.exchangeBuilder.buildAccount(accountName);
    if (!this.tradingServices.has(entryName)) {
      throw new RangeError(`Unknown entry tactic: ${entryName}`);
    }
    if (!this.tradingServices.has(exitName)) {
      throw new RangeError(`Unknown exit tactic: ${exitName}`);
    }

    const positionService = this.tradingServices.get("position");
    const entryFactory = this.tradingServices.get(entryName);
    const exitFactory = this.tradingServices.get(exitName);

    const entryTactic = entryFactory.build(account.getName(), ...entryParameters.split(","));
    const exitTactic = exitFactory.build(account.getName(), ...exitParameters.split(","));
    const position = await positionService.create(entryTactic, exitTactic);
    console.log(position);
  }
};
