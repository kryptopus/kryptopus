const StrategyCompilerPass = require("./domain/trading/dependencyInjection/StrategyCompilerPass");

module.exports = class KryptopusBundle {
  getPath() {
    return __dirname;
  }

  configureContainer(container) {
    container.addCompilerPass(new StrategyCompilerPass());
  }
};
