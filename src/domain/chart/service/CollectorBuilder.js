/* @flow */
import {bind} from "decko"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import type CollectorRegistry from "./CollectorRegistry"
import type {CollectorInterface} from "../model/CollectorInterface"

/**
 * Build collectors
 */
export default class CollectorBuilder
{
    /**
     * Solfege service container
     */
    container:Container;

    /**
     * Collector registry
     */
    registry:CollectorRegistry;

    /**
     * Constructor
     *
     * @param   {CollectorRegistry} registry    Collector registry
     * @param   {Container}         container   Solfege service container
     */
    constructor(registry:CollectorRegistry, container:Container)
    {
        this.registry = registry;
        this.container = container;
    }

    /**
     * Build collector instance
     *
     * @param   {string}                source      Source identifier
     * @return  {CollectorInterface}                Collector instance
     */
    @bind
    async build(source:string):Promise<CollectorInterface>
    {
        const collectorDefinition = this.registry.getBySource(source);

        return await this.container.buildInstance(collectorDefinition);
    }
}
