/* @flow */
import {bind} from "decko"
import type {DefinitionInterface} from "solfegejs-dependency-injection/interface"

/**
 * Register bot definitions
 */
export default class BotRegistry
{
    /**
     * Bot definitions
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
     * Add a bot definition
     *
     * @param   {string}        id              Bot identifier
     * @param   {Definition}    botDefinition   Bot definition
     * @param   {any}           options         Options
     */
    @bind
    addDefinition(id:string, botDefinition:DefinitionInterface, options?:any)
    {
        let botIdentifier = id;
        if (options && typeof options === "object" && options.alias) {
            botIdentifier = options.alias;
        }

        this.definitions.set(botIdentifier, botDefinition);
    }

    /**
     * Get available bot definitions
     *
     * @return  {Map}   Available bot definitions
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
     * Get bot definition by its identifier
     *
     * @param   {string}                id  Bot identifier
     * @return  {DefinitionInterface}       Bot definition
     */
    @bind
    getById(id:string):DefinitionInterface
    {
        if (!this.definitions.has(id)) {
            throw new Error(`Unable to get bot definition, "${id}" not found`);
        }

        const definition = this.definitions.get(id);
        if (!definition) {
            throw new Error(`Unable to get bot definition, "${id}" not found`);
        }

        return definition;
    }
}
