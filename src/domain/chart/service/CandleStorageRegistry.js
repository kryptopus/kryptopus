/* @flow */
import {bind} from "decko"
import type {DefinitionInterface} from "solfegejs-dependency-injection/interface"

/**
 * Register candle storage definitions
 */
export default class CandleStorageRegistry
{
    /**
     * Storage definitions
     */
    definitions:Map<string, DefinitionInterface>;

    /**
     * Constructor
     */
    constructor()
    {
        this.definitions = new Map;
    }

    /**
     * Add a storage definition
     *
     * @param   {string}        type                    Type identifier
     * @param   {Definition}    storageDefinition       Storage definition
     * @param   {any}           options                 Options
     */
    @bind
    addDefinition(type:string, storageDefinition:DefinitionInterface, options?:any)
    {
        this.definitions.set(type, storageDefinition);
    }

    /**
     * Get available storage definitions
     *
     * @return  {Map}   Available storage definitions
     */
    @bind
    getDefinitions():Map<string, DefinitionInterface>
    {
        return this.definitions;
    }

    /**
     * Get registered types
     *
     * @return  {Array}     Registered sources
     */
    @bind
    getTypes():Array<string>
    {
        return Array.from(this.definitions.keys());
    }

    /**
     * Get storage definition by its type
     *
     * @param   {string}                type        Type identifier
     * @return  {DefinitionInterface}               Storage definition
     */
    @bind
    getByType(type:string):DefinitionInterface
    {
        if (!this.definitions.has(type)) {
            throw new Error(`Unable to get storage definition, type "${type}" not found`);
        }

        const definition = this.definitions.get(type);
        if (!definition) {
            throw new Error(`Unable to get storage definition, type "${type}" not found`);
        }

        return definition;
    }
}
