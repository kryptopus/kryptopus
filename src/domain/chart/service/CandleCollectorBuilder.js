/* @flow */
import {bind} from "decko"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import type CandleCollectorRegistry from "./CandleCollectorRegistry"
import type {CandleCollectorInterface} from "../model/CandleCollectorInterface"

/**
 * Build candle collectors
 */
export default class CandleCollectorBuilder
{
    /**
     * Solfege service container
     */
    container:Container;

    /**
     * Collector registry
     */
    registry:CandleCollectorRegistry;

    /**
     * Constructor
     *
     * @param   {CandleCollectorRegistry}   registry    Collector registry
     * @param   {Container}                 container   Solfege service container
     */
    constructor(registry:CandleCollectorRegistry, container:Container)
    {
        this.registry = registry;
        this.container = container;
    }

    /**
     * Build collector instance
     *
     * @param   {string}                    source      Source identifier
     * @return  {CandleCollectorInterface}              Collector instance
     */
    @bind
    async build(source:string):Promise<CandleCollectorInterface>
    {
        const collectorDefinition = this.registry.getBySource(source);

        return await this.container.buildInstance(collectorDefinition);
    }
}
