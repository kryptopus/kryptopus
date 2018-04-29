/**
 * Compiler pass for the service container
 * It handles tags to register bots
 */
export default class RegisterBotCompilerPass
{
    /**
     * Process the tags
     *
     * @param   {Container}     container   Service container
     */
    async process(container)
    {
        let registryDefinition = container.getDefinition("kryptopus_bot_registry");

        let serviceIds = container.findTaggedServiceIds("kryptopus.bot");
        for (let serviceId of serviceIds) {
            let botDefinition = container.getDefinition(serviceId);
            let botTags = botDefinition.getTags();

            for (let tag of botTags) {
                if (tag.name !== "kryptopus.bot") {
                    continue;
                }

                let options = Object.assign({}, tag);
                delete options.name;

                registryDefinition.addMethodCall("addBotDefinition", [
                    serviceId,
                    botDefinition,
                    options
                ]);
            }
        }
    }
}
