const formatPrice = require("../../util/formatPrice");
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
        description: "Quote asset",
        defaultValue: "USD"
      }
    ];
  }

  async execute(options) {
    const quoteAsset = options.quote;
    const exchanges = this.exchangeBuilder.buildAll();

    const balances = {};
    for (const exchange of exchanges) {
      const exchangeBalances = await exchange.getBalances();
      for (const exchangeBalance of exchangeBalances) {
        const { asset } = exchangeBalance;
        if (!balances[asset]) {
          balances[asset] = 0;
        }
        balances[asset] += exchangeBalance.total;
      }
    }

    const assets = Object.keys(balances);
    const prices = await this.cryptocompare.getMultipleAssetPrice(assets, quoteAsset);

    const noPriceFound = [];
    let total = 0;
    for (const asset of assets) {
      if (!prices[asset]) {
        noPriceFound.push(asset);
        continue;
      }
      total += balances[asset] * prices[asset][quoteAsset];
    }

    process.stdout.write(`${colorizePrice(formatPrice(total, 2))} ${quoteAsset}\n`);
    if (noPriceFound.length > 0) {
      process.stdout.write(`No price found for: ${noPriceFound.join(", ")}\n`);
    }
  }
};
