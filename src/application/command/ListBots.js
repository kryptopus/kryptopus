/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"
import type ListBotsQuery from "../../domain/bot/query/ListBots"

/**
 * List available bots
 */
export default class ListBots extends ContainerAwareCommand
{
    query:ListBotsQuery;

    constructor(query:ListBotsQuery)
    {
        super();

        this.query = query;
    }

    async configure()
    {
        this.setName("bot:list");
        this.setDescription("List available bots");
    }

    async execute(parameters:Array<string>)
    {
        const names = await this.query.list();
        for (let name of names) {
            console.log("-", name);
        }
    }
}
