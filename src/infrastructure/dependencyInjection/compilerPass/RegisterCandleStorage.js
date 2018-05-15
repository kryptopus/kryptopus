/**
 * Compiler pass for the service container
 * It handles tags to register candle storages
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
        let registryDefinition = container.getDefinition("kryptopus_chart_candle_storage_registry");

        let serviceIds = container.findTaggedServiceIds("kryptopus.chart.candle.storage");
        for (let serviceId of serviceIds) {
            let storageDefinition = container.getDefinition(serviceId);
            let storageTags = storageDefinition.getTags();

            for (let tag of storageTags) {
                if (tag.name !== "kryptopus.chart.candle.storage") {
                    continue;
                }

                if (!tag.type) {
                    continue;
                }

                let options = Object.assign({}, tag);
                delete options.name;
                delete options.type;

                registryDefinition.addMethodCall("addDefinition", [
                    tag.type,
                    storageDefinition,
                    options
                ]);
            }
        }
    }
}
