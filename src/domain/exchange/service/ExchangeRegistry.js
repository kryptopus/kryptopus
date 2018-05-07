/* @flow */
import {bind} from "decko"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import type {DefinitionInterface} from "solfegejs-dependency-injection/interface"

/**
 * Register exchange definitions
 */
export default class BotRegistry
{
    /**
     * Solfege service container
     */
    container:Container;

    /**
     * Exchange definitions
     */
    definitions:Map<string, DefinitionInterface>;

    /**
     * Constructor
     *
     * @param   {Container}     container   Solfege service container
     */
    constructor(container:Container)
    {
        this.container = container;
        this.definitions = new Map;
    }

    /**
     * Add an exchange definition
     *
     * @param   {string}        id                  Exchange identifier
     * @param   {Definition}    exchangeDefinition  Exchange definition
     * @param   {any}           options             Options
     */
    @bind
    addDefinition(id:string, exchangeDefinition:DefinitionInterface, options?:any)
    {
        let exchangeIdentifier = id;
        if (options && typeof options === "object" && options.alias) {
            exchangeIdentifier = options.alias;
        }

        this.definitions.set(exchangeIdentifier, exchangeDefinition);
    }

    /**
     * Get available exchange definitions
     *
     * @return  {Map}   Available exchange definitions
     */
    @bind
    getDefinitions():Map<string, DefinitionInterface>
    {
        return this.definitions;
    }

    /**
     * Get registered identifiers
     *
     * @return  {Array}     Registered identifiers
     */
    @bind
    getIds():Array<string>
    {
        return Array.from(this.definitions.keys());
    }

    /**
     * Get exchange definition by its identifier
     *
     * @param   {string}                id  Exchange identifier
     * @return  {DefinitionInterface}       Exchange definition
     */
    @bind
    getById(id:string):DefinitionInterface
    {
        if (!this.definitions.has(id)) {
            throw new Error(`Unable to get exchange definition, "${id}" not found`);
        }

        const definition = this.definitions.get(id);
        if (!definition) {
            throw new Error(`Unable to get exchange definition, "${id}" not found`);
        }

        return definition;
    }

}
