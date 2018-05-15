/* @flow */
import type Candle from "./Candle"

/**
 * Collect candles
 */
export interface CandleCollectorInterface
{
    collect(exchange:string, baseAsset:string, quoteAsset:string, interval:number, startTime:number, endTime:number):Array<Candle> | Promise<Array<Candle>>;
}
