module.exports = class StrategyCompilerPass {
  async process(container) {
    const definition = container.getDefinition("trading_strategy_registry");

    const serviceIds = container.findTaggedServiceIds("kryptopus.trading.strategy");
    for (const serviceId of serviceIds) {
      const reference = container.getReference(serviceId);
      definition.addMethodCall("addStrategy", [reference]);
    }
  }
};
