const asTable = require("as-table");
const { format } = require("date-fns");
const { cyan, dim } = require("colors/safe");
const AbstractCommand = require("@solfege/cli/lib/Command/AbstractCommand");

module.exports = class GetOpenOrders extends AbstractCommand {
  constructor(exchangeBuilder) {
    super();

    this.exchangeBuilder = exchangeBuilder;

    this.setName("exchange:binance:open_orders");
    this.setDescription("Get Binance open orders");
    this.addArgument("accountName", "Account name");
  }

  async execute(accountName) {
    const binance = this.exchangeBuilder.buildAccount(accountName);
    const orders = await binance.getOpenOrders();

    const output = asTable.configure({
      title: x => cyan(x),
      dash: dim("─"),
      print: (value, title) => {
        if (title === "time") {
          return format(new Date(value), "MM/DD/YYYY HH:mm:ss");
        }

        return String(value);
      }
    })(orders);
    process.stdout.write(output);
    process.stdout.write("\n");
  }
};
