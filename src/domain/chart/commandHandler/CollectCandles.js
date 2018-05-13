/* @flow */
import type CollectCandlesCommand from "../command/CollectCandles"
import type CollectorBuilder from "../service/CollectorBuilder"

/**
 * Command handler to collect candles
 */
export default class CollectCandles
{
    collectorBuilder:CollectorBuilder;

    constructor(collectorBuilder:CollectorBuilder)
    {
        this.collectorBuilder = collectorBuilder;
    }

    async handle(command:CollectCandlesCommand):Promise<void>
    {
        const collector = await this.collectorBuilder.build(command.source);
        const candles = await collector.collect(
            command.exchange,
            command.baseAsset,
            command.quoteAsset,
            command.interval,
            command.startTime,
            command.endTime
        );

        console.log(candles);
    }
}
