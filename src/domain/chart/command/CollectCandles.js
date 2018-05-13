/* @flow */

/**
 * Command to collect candles
 */
export default class CollectCandles
{
    source:string;
    exchange:string;
    baseAsset:string;
    quoteAsset:string;
    interval:number;
    startTime:number;
    endTime:number;

    constructor(source:string, exchange:string, baseAsset:string, quoteAsset:string, interval:number, startTime:number, endTime:number)
    {
        this.source = source;
        this.exchange = exchange;
        this.baseAsset = baseAsset;
        this.quoteAsset = quoteAsset;

        // Interval
        if (!Number.isInteger(interval)) {
            throw new Error(`Interval must be an integer`);
        }
        this.interval = interval;

        // Period
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
