module.exports = class Balance {
  constructor(accountName, asset, total) {
    this.accountName = accountName;
    this.asset = asset;
    this.total = total;
  }
};
