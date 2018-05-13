/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"
import CollectCandlesCommand from "../../domain/chart/command/CollectCandles"
import type CollectCandlesHandler from "../../domain/chart/commandHandler/CollectCandles"

/**
 * Collect candles
 */
export default class CollectCandles extends ContainerAwareCommand
{
    /**
     * Handler of the command
     */
    handler:CollectCandlesHandler;

    /**
     * Constructor
     *
     * @param   {CollectCandlesHandler}     handler     Handler of the command
     */
    constructor(handler:CollectCandlesHandler)
    {
        super();

        this.handler = handler;
    }

    /**
     * Configure the command
     */
    async configure()
    {
        this.setName("chart:collect-candles");
        this.setDescription("Collect candles");
    }

    /**
     * Execute the command
     */
    async execute(parameters:Array<string>)
    {
        if (parameters.length <= 0) {
            throw new Error("Please provide a source");
        }

        if (parameters.length <= 1) {
            throw new Error("Please provide an exchange");
        }

        if (parameters.length <= 2) {
            throw new Error("Please provide a base asset");
        }

        if (parameters.length <= 3) {
            throw new Error("Please provide a quote asset");
        }

        if (parameters.length <= 4) {
            throw new Error("Please provide an interval");
        }

        if (parameters.length <= 5) {
            throw new Error("Please provide a start time");
        }

        if (parameters.length <= 6) {
            throw new Error("Please provide an end time");
        }

        const source = parameters.shift();
        const exchange = parameters.shift();
        const baseAsset = parameters.shift();
        const quoteAsset = parameters.shift();
        const interval = Number(parameters.shift());
        const startTime = Number(parameters.shift());
        const endTime = Number(parameters.shift());
        const command = new CollectCandlesCommand(source, exchange, baseAsset, quoteAsset, interval, startTime, endTime);

        await this.handler.handle(command);
    }
}
