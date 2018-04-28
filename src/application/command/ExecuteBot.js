/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"

/**
 * Run a bot
 */
export default class ExecuteBot extends ContainerAwareCommand
{
    /**
     * Configure the command
     */
    async configure()
    {
        this.setName("bot:execute");
        this.setDescription("Execute a bot");
    }

    /**
     * Execute the command
     */
    async execute(parameters:Array<string>)
    {
        if (parameters.length <= 0) {
            throw new Error("Please provide a bot identifier");
        }

        const botId = parameters.shift();

        console.info(`Execute ${botId}`);
    }
}
