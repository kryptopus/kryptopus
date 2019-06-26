const buildExchange = require("../../exchange/buildExchange");
const formatPrice = require("../../util/formatPrice");
const colorizePrice = require("../util/colorizePrice");

module.exports = class GetBalances {
  constructor(cryptocompare, exchangeAccounts) {
    this.cryptocompare = cryptocompare;
    this.exchangeAccounts = exchangeAccounts;
  }

  getName() {
    return "portfolio:estimate_total_amount";
  }

  getDescription() {
    return "Estimate total amount";
  }

  async execute() {
    const balances = {};
    for (const accountName in this.exchangeAccounts) {
      const account = this.exchangeAccounts[accountName];
      const exchange = buildExchange(account);
      const exchangeBalances = await exchange.getBalances();
      for (const exchangeBalance of exchangeBalances) {
        let { asset } = exchangeBalance;
        if (asset === "HOT") {
          asset = "HOLO";
        }
        if (!balances[asset]) {
          balances[asset] = 0;
        }
        balances[asset] += exchangeBalance.total;
      }
    }

    const assets = Object.keys(balances);
    const prices = await this.cryptocompare.getMultipleAssetPrice(assets, "USD");

    const noPriceFound = [];
    let total = 0;
    for (const asset of assets) {
      if (!prices[asset]) {
        noPriceFound.push(asset);
        continue;
      }
      total += balances[asset] * prices[asset].USD;
    }

    process.stdout.write(`${colorizePrice(formatPrice(total, 2))} USD\n`);
    if (noPriceFound.length > 0) {
      process.stdout.write(`No price found for: ${noPriceFound.join(", ")}\n`);
    }
  }
};
