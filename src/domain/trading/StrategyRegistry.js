module.exports = class StrategyRegistry {
  constructor() {
    this.strategies = [];
  }

  addStrategy(strategy) {
    this.strategies.push(strategy);
  }
};
