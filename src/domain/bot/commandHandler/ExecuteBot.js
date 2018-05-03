/* @flow */
import type BotBuilder from "../service/BotBuilder"
import type BotContextBuilder from "../service/BotContextBuilder"
import type ExecuteBotCommand from "../command/ExecuteBot"

/**
 * Command handler to execute a bot
 */
export default class ExecuteBot
{
    /**
     * Bot builder
     */
    builder:BotBuilder;

    /**
     * Bot context builder
     */
    contextBuilder:BotContextBuilder;

    /**
     * Constructor
     *
     * @param   {BotBuilder}        builder         Bot builder
     * @param   {BotContextBuilder} contextBuilder  Bot context builder
     */
    constructor(builder:BotBuilder, contextBuilder:BotContextBuilder)
    {
        this.builder = builder;
        this.contextBuilder = contextBuilder;
    }

    /**
     * Execute a bot
     *
     * @param   {ExecuteBotCommand}     command     Domain command
     */
    async handle(command:ExecuteBotCommand):Promise<void>
    {
        const bot = await this.builder.build(command.name);
        const context = await this.contextBuilder.build(command.name);
        await bot.execute(context);
    }
}
