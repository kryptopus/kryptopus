/**
 * Compiler pass for the service container
 * It handles tags to register candle collectors
 */
export default class RegisterCandleCollector
{
    /**
     * Process the tags
     *
     * @param   {Container}     container   Service container
     */
    async process(container)
    {
        let registryDefinition = container.getDefinition("kryptopus_chart_candle_collector_registry");

        let serviceIds = container.findTaggedServiceIds("kryptopus.chart.candle.collector");
        for (let serviceId of serviceIds) {
            let collectorDefinition = container.getDefinition(serviceId);
            let collectorTags = collectorDefinition.getTags();

            for (let tag of collectorTags) {
                if (tag.name !== "kryptopus.chart.candle.collector") {
                    continue;
                }

                if (!tag.source) {
                    continue;
                }

                let options = Object.assign({}, tag);
                delete options.name;
                delete options.source;

                registryDefinition.addMethodCall("addDefinition", [
                    tag.source,
                    collectorDefinition,
                    options
                ]);
            }
        }
    }
}
