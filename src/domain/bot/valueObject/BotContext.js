/* @flow */
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"

/**
 * Bot context
 */
export default class BotContext
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
}
