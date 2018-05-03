/* @flow */
import BotRegistry from "../service/BotRegistry"

/**
 * List available bots
 */
export default class ListBots
{
    registry:BotRegistry;

    constructor(registry:BotRegistry)
    {
        this.registry = registry;
    }

    async list():Promise<Array<string>>
    {
        return this.registry.getIds();
    }
}
