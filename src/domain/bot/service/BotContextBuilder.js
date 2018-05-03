/* @flow */
import {bind} from "decko"
import winston from "winston"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import BotContext from "../model/BotContext"

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
     *
     * @param   {string}        name    Bot name
     * @return  {BotContext}            Bot context
     */
    @bind
    async build(name:string):Promise<BotContext>
    {
        const time = (new Date).valueOf();

        // Create logger
        const logPath = `${__dirname}/../../../../var/log/bot/${time}.${name}.log`;
        const logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.align(),
                winston.format.printf(info => `[${info.timestamp}][${info.level}] ${info.message}`)
            ),
            transports: [
                new winston.transports.File({
                    filename: logPath
                })
            ]
        });

        // Create context
        let context:BotContext = new BotContext(
            this.container,
            logger
        );

        return context;
    }
}
