module.exports = class Balance {
  constructor(asset, total, inOrder) {
    this.asset = asset;
    this.total = total;
    this.inOrder = inOrder;
    this.available = total - inOrder;
  }
};
