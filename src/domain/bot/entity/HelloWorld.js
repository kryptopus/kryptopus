/* @flow */
import type {BotInterface} from "./BotInterface"
import type BotContext from "../valueObject/BotContext"

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
