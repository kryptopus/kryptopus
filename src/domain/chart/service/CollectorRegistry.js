/* @flow */
import {bind} from "decko"
import type {DefinitionInterface} from "solfegejs-dependency-injection/interface"

/**
 * Register collector definitions
 */
export default class CollectorRegistry
{
    /**
     * Collector definitions
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
     * Add a collector definition
     *
     * @param   {string}        source                  Source identifier
     * @param   {Definition}    collectorDefinition     Collector definition
     * @param   {any}           options                 Options
     */
    @bind
    addDefinition(source:string, collectorDefinition:DefinitionInterface, options?:any)
    {
        this.definitions.set(source, collectorDefinition);
    }

    /**
     * Get available collector definitions
     *
     * @return  {Map}   Available collector definitions
     */
    @bind
    getDefinitions():Map<string, DefinitionInterface>
    {
        return this.definitions;
    }

    /**
     * Get registered sources
     *
     * @return  {Array}     Registered sources
     */
    @bind
    getSources():Array<string>
    {
        return Array.from(this.definitions.keys());
    }

    /**
     * Get collector definition by its source
     *
     * @param   {string}                source      Source identifier
     * @return  {DefinitionInterface}               Collector definition
     */
    @bind
    getBySource(source:string):DefinitionInterface
    {
        if (!this.definitions.has(source)) {
            throw new Error(`Unable to get collector definition, source "${source}" not found`);
        }

        const definition = this.definitions.get(source);
        if (!definition) {
            throw new Error(`Unable to get collector definition, source "${source}" not found`);
        }

        return definition;
    }
}
