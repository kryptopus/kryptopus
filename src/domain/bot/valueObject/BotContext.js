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
     * Logger
     */
    logger:any;

    /**
     * Constructor
     *
     * @param   {Container}     container   Bot service container
     * @param   {any}           logger      Logger
     */
    constructor(container:Container, logger:any)
    {
        this.container = container;
        this.logger = logger;
    }

    /**
     * Log information
     *
     * @param   {string}    message     Message
     */
    logInfo(message:string):void
    {
        this.logger.info(message);
    }

    /**
     * Get service instance
     *
     * @param   {string}    name    Service name
     * @return  {any}               Service instance
     */
    async getService(name:string):Promise<any>
    {
        return await this.container.get(name);
    }
}
