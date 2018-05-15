/* @flow */
import {bind} from "decko"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import type CandleStorageRegistry from "./CandleStorageRegistry"
import type {CandleStorageInterface} from "../model/CandleStorageInterface"

/**
 * Build candle storages
 */
export default class CandleStorageBuilder
{
    /**
     * Solfege service container
     */
    container:Container;

    /**
     * Storage registry
     */
    registry:CandleStorageRegistry;

    /**
     * Constructor
     *
     * @param   {CandleStorageRegistry}     registry    Storage registry
     * @param   {Container}                 container   Solfege service container
     */
    constructor(registry:CandleStorageRegistry, container:Container)
    {
        this.registry = registry;
        this.container = container;
    }

    /**
     * Build storage instance
     *
     * @param   {string}                    type        Type identifier
     * @return  {CandleStorageInterface}                Collector instance
     */
    @bind
    async build(type:string):Promise<CandleStorageInterface>
    {
        const storageDefinition = this.registry.getByType(type);

        return await this.container.buildInstance(storageDefinition);
    }
}
