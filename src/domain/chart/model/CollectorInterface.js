/* @flow */
import type Candle from "./Candle"

/**
 * Collector interface
 */
export interface CollectorInterface
{
    collect(exchange:string, baseAsset:string, quoteAsset:string, interval:number, startTime:number, endTime:number):Array<Candle> | Promise<Array<Candle>>;
}
