/* @flow */
import {bind} from "decko"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import BotContext from "../valueObject/BotContext"

/**
 * Build bot context
 */
export default class BotContextBuilder
{
    /**
     * Bot service container
     */
    container:Container;

    /**
     * Constructor
     *
     * @param   {Container}     container   Bot service container
     */
    constructor(container:Container)
    {
        this.container = container;
    }

    /**
     * Build a bot context
     */
    @bind
    async build():Promise<BotContext>
    {
        let context:BotContext = new BotContext(this.container);

        return context;
    }
}
