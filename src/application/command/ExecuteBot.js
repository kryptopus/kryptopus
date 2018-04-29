/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"
import type BotBuilder from "../../domain/bot/service/BotBuilder"

/**
 * Run a bot
 */
export default class ExecuteBot extends ContainerAwareCommand
{
    constructor(builder:BotBuilder)
    {
        super();

        this.builder = builder;
    }

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
        const bot = await this.builder.build(botId);

        console.info(`Execute ${botId} ...`);
        await bot.execute();
    }
}
