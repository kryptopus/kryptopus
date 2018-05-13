/* @flow */

/**
 * Japanese candle stick
 */
export default class Candle
{
    openTime:number;
    closeTime:number;
    open:number;
    close:number;
    low:number;
    high:number;
    volume:number;
    tradeCount:number;


    constructor(
        openTime:number,
        closeTime:number,
        open:number,
        close:number,
        low:number,
        high:number
    ) {
        // Set open/close times
        this.openTime = openTime;
        if (closeTime < openTime) {
            throw new Error(`Close time is lower than open time`);
        }
        this.closeTime = closeTime;

        // Set open/close prices
        this.open = open;
        this.close = close;

        // Set high/low prices
        if (low > open || low > close || low > high) {
            throw new Error(`Low price is not the lowest price`);
        }
        if (high < open || high < close || high < low) {
            throw new Error(`High price is not the highest price`);
        }
        this.low = low;
        this.high = high;
    }
}
