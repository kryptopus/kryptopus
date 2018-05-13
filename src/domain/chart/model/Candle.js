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
        high:number,
        volume?:number,
        tradeCount?:number
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

        // Volume
        if (volume) {
            this.volume = volume;
        }

        // Trade count
        if (tradeCount) {
            this.tradeCount = tradeCount;
        }
    }

    inspect(depth:number, options:any):string
    {
        if (depth < 0) {
            return options.stylize("[Candle]", "special");
        }

        const inner = `O: ${this.open} | H: ${this.high} | L: ${this.low} | C: ${this.close}`;
        return `${options.stylize("Candle", "special")} [ ${inner} ]`;
    }
}
