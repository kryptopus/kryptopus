/* @flow */

/**
 * Command to execute a bot
 */
export default class ExecuteBot
{
    /**
     * Bot name
     */
    name:string;

    /**
     * Constructor
     *
     * @param   {string}    name    Bot name
     */
    constructor(name:string)
    {
        this.name = name;
    }
}
