/* @flow */
import type {BotInterface} from "./BotInterface"

export default class HelloWorld implements BotInterface
{
    /**
     * Execute the bot
     *
     * @param   {Array}     parameters  Bot parameters
     */
    async execute(parameters:Array<string>):void | Promise<void>
    {
        console.info("Hello world!");
    }

}
