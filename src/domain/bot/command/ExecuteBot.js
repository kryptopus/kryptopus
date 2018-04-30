/* @flow */
import type BotBuilder from "../service/BotBuilder"
import type BotContextBuilder from "../service/BotContextBuilder"

/**
 * Execute a bot
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
     * @param   {string}    name        Bot name
     * @param   {any}       parameters  Bot parameters
     */
    async execute(name:string, parameters:?any):Promise<void>
    {
        const bot = await this.builder.build(name);
        const context = await this.contextBuilder.build(name);
        await bot.execute(context);
    }
}
