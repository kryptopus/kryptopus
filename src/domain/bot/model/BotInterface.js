/* @flow */
import type BotContext from "./BotContext"

/**
 * Bot interface
 */
export interface BotInterface
{
    /**
     * Execute the bot
     *
     * @param   {BotContext}    context     Bot context
     */
    execute(context:BotContext):void | Promise<void>;
}

