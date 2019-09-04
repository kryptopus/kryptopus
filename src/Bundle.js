const StrategyCompilerPass = require("./domain/trading/dependencyInjection/StrategyCompilerPass");
const ServiceCompilerPass = require("./domain/trading/dependencyInjection/ServiceCompilerPass");

module.exports = class KryptopusBundle {
  getPath() {
    return __dirname;
  }

  configureContainer(container) {
    container.addCompilerPass(new StrategyCompilerPass());
    container.addCompilerPass(new ServiceCompilerPass());
  }
};
