/* @flow */
import type {BotInterface} from "../../../../src/domain/bot/model/BotInterface"
import type BotContext from "../../../../src/domain/bot/model/BotContext"

export default class HelloWorld implements BotInterface
{
    /**
     * Execute the bot
     *
     * @param   {BotContext}    context     Bot context
     */
    async execute(context:BotContext):void | Promise<void>
    {
        console.info("Hello world!");
    }

}
