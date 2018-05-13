/**
 * Compiler pass for the service container
 * It handles tags to register chart collectors
 */
export default class RegisterChartCollectorCompilerPass
{
    /**
     * Process the tags
     *
     * @param   {Container}     container   Service container
     */
    async process(container)
    {
        let registryDefinition = container.getDefinition("kryptopus_chart_collector_registry");

        let serviceIds = container.findTaggedServiceIds("kryptopus.chart.collector");
        for (let serviceId of serviceIds) {
            let collectorDefinition = container.getDefinition(serviceId);
            let collectorTags = collectorDefinition.getTags();

            for (let tag of collectorTags) {
                if (tag.name !== "kryptopus.chart.collector") {
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
