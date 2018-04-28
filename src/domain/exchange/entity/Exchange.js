/* @flow */

/**
 * Exchange
 */
export default class Exchange
{
    id:string;
    type:string;
    configuration:any;

    setId(id:string)
    {
        this.id = id;
    }

    getId():string
    {
        return this.id;
    }

    setType(type:string)
    {
        this.type = type;
    }
    getType():string
    {
        return this.type;
    }

    setConfiguration(config:any)
    {
        this.configuration = config;
    }
    getConfiguration():any
    {
        return this.configuration;
    }
}
