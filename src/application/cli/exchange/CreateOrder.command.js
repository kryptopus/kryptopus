const asTable = require("as-table");
const { format } = require("date-fns");
const { cyan, dim } = require("colors/safe");
const AbstractCommand = require("@solfege/cli/AbstractCommand");
const ExchangeBuilder = require("../../../domain/exchange/ExchangeBuilder");

module.exports = class CreateOrder extends AbstractCommand {
  /**
   * @param {ExchangeBuilder} exchangeBuilder
   */
  constructor(exchangeBuilder) {
    super();

    this.exchangeBuilder = exchangeBuilder;

    this.setName("exchange:order:create");
    this.setDescription("Create order");
    this.addArgument("accountName", "Account name");
    this.addArgument("side", "BUY or SELL");
    this.addArgument("type", "LIMIT or MARKET");
    this.addArgument("baseSymbol", "Base symbol");
    this.addArgument("quoteSymbol", "Quote symbol");
    this.addOption("--baseQuantity <quantity>", "Base quantity");
    this.addOption("--price <price>", "Target price");
  }

  async execute(accountName, side, type, baseSymbol, quoteSymbol, options) {
    const account = this.exchangeBuilder.buildAccount(accountName);
    const order = await account.createOrder(side, type, baseSymbol, quoteSymbol, options.price, options.baseQuantity);

    const output = asTable.configure({
      title: x => cyan(x),
      dash: dim("─"),
      print: (value, title) => {
        if (title === "time") {
          return format(new Date(value), "MM/DD/YYYY HH:mm:ss");
        }

        return String(value);
      }
    })([order]);
    process.stdout.write(output);
    process.stdout.write("\n");
  }
};
