/* @flow */
import {bind} from "decko"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import type BotRegistry from "./BotRegistry"
import type {BotInterface} from "../entity/BotInterface"

/**
 * Build bots
 */
export default class BotBuilder
{
    /**
     * Solfege service container
     */
    container:Container;

    /**
     * Bot registry
     */
    registry:BotRegistry;

    /**
     * Constructor
     *
     * @param   {BotRegistry}   registry    Bot registry
     * @param   {Container}     container   Solfege service container
     */
    constructor(registry:BotRegistry, container:Container)
    {
        this.registry = registry;
        this.container = container;
    }

    /**
     * Build bot instance
     *
     * @param   {string}        id  Bot identifier
     * @return  {BotInterface}      Bot instance
     */
    @bind
    async build(id:string):Promise<BotInterface>
    {
        const botDefinition = this.registry.getById(id);

        return await this.container.buildInstance(botDefinition);
    }

}
