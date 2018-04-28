/* @flow */
import Exchange from "../entity/Exchange"

/**
 * Find exchanges
 */
export default class ExchangeFinder
{
    /**
     * Exchanges
     */
    exchanges:Array<Exchange>;

    /**
     * Constructor
     *
     * @param   {Object}    config  Configuration
     */
    constructor(config:any)
    {
        this.exchanges = [];
        for (let id in config) {
            let exchange = new Exchange();
            exchange.setId(id);
            exchange.setType(config[id].type);
            exchange.setConfiguration(config[id]);

            this.exchanges.push(exchange);
        }
    }

    /**
     * Get all exchanges
     *
     * @return  {Exchange[]}    Exchanges
     */
    async getAll():Promise<Array<Exchange>>
    {
        return this.exchanges;
    }
}
