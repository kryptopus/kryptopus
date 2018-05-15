/* @flow */
import type Candle from "./Candle"

/**
 * Store candles
 */
export interface CandleStorageInterface
{
    store(candle:Candle):void | Promise<void>;
}
