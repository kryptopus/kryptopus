/* @flow */

/**
 * Bot interface
 */
export interface BotInterface
{
    /**
     * Execute the bot
     *
     * @param   {Array}     parameters  Bot parameters
     */
    execute(parameters:Array<string>):void | Promise<void>;
}

