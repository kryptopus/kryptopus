module.exports = class ServiceCompilerPass {
  async process(container) {
    const definition = container.getDefinition("trading_service_registry");

    const serviceIds = container.findTaggedServiceIds("kryptopus.trading.service");
    for (const serviceId of serviceIds) {
      const reference = container.getReference(serviceId);
      const serviceDefinition = container.getDefinition(serviceId);
      const tags = serviceDefinition.getTags();
      for (const tag of tags) {
        if (tag.name === "kryptopus.trading.service" && tag.id) {
          definition.addMethodCall("set", [tag.id, reference]);
        }
      }
    }
  }
};
