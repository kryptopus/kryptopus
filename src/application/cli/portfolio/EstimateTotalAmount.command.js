const formatPrice = require("../../../util/formatPrice");
const colorizePrice = require("../util/colorizePrice");

module.exports = class GetBalances {
  constructor(cryptocompare, exchangeBuilder) {
    this.cryptocompare = cryptocompare;
    this.exchangeBuilder = exchangeBuilder;
  }

  getName() {
    return "portfolio:estimate_total_amount";
  }

  getDescription() {
    return "Estimate total amount";
  }

  getOptions() {
    return [
      {
        flags: "--quote <string>",
        description: "Quote symbol",
        defaultValue: "USD"
      }
    ];
  }

  async execute(options) {
    const quoteAsset = options.quote;
    const accounts = this.exchangeBuilder.buildAccounts();

    const balances = {};
    for (const account of accounts) {
      const accountBalances = await account.getBalances();
      for (const accountBalance of accountBalances) {
        const { symbol } = accountBalance;
        if (!balances[symbol]) {
          balances[symbol] = 0;
        }
        balances[symbol] += accountBalance.total;
      }
    }

    const symbols = Object.keys(balances);
    const prices = await this.cryptocompare.getMultipleAssetPrice(symbols, quoteAsset);

    const noPriceFound = [];
    let total = 0;
    for (const symbol of symbols) {
      if (!prices[symbol]) {
        noPriceFound.push(symbol);
        continue;
      }
      total += balances[symbol] * prices[symbol][quoteAsset];
    }

    process.stdout.write(`${colorizePrice(formatPrice(total, 2))} ${quoteAsset}\n`);
    if (noPriceFound.length > 0) {
      // process.stdout.write(`No price found for: ${noPriceFound.join(", ")}\n`);
    }
  }
};
