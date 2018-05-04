/* @flow */
import {bind} from "decko"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import type {DefinitionInterface} from "solfegejs-dependency-injection/interface"

/**
 * Register bot definitions
 */
export default class BotRegistry
{
    /**
     * Solfege service container
     */
    container:Container;

    /**
     * Bot definitions
     */
    botDefinitions:Map<string, DefinitionInterface>;

    /**
     * Constructor
     *
     * @param   {Container}     container   Solfege service container
     */
    constructor(container:Container)
    {
        this.container = container;
        this.botDefinitions = new Map;
    }

    /**
     * Add a bot definition
     *
     * @param   {string}        id              Bot identifier
     * @param   {Definition}    botDefinition   Bot definition
     * @param   {any}           options         Options
     */
    @bind
    addBotDefinition(id:string, botDefinition:DefinitionInterface, options?:any)
    {
        let botIdentifier = id;
        if (options && typeof options === "object" && options.alias) {
            botIdentifier = options.alias;
        }

        this.botDefinitions.set(botIdentifier, botDefinition);
    }

    /**
     * Get available bot definitions
     *
     * @return  {Map}   Available bot definitions
     */
    @bind
    getBotDefinitions():Map<string, DefinitionInterface>
    {
        return this.botDefinitions;
    }

    /**
     * Get registered identifiers
     *
     * @return  {Array}     Registered identifier
     */
    @bind
    getIds():Array<string>
    {
        return Array.from(this.botDefinitions.keys());
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
        if (!this.botDefinitions.has(id)) {
            throw new Error(`Unable to get bot definition, "${id}" not found`);
        }

        const definition = this.botDefinitions.get(id);
        if (!definition) {
            throw new Error(`Unable to get bot definition, "${id}" not found`);
        }

        return definition;
    }

}
