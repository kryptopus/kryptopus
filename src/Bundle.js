/* @flow */
import {bind} from "decko"
import path from "path"
import configYaml from "config-yaml"
import type {BundleInterface} from "solfegejs-application/src/BundleInterface"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import Definition from "solfegejs-dependency-injection/lib/ServiceContainer/Definition"
import type Application from "solfegejs-application"
import RegisterBotCompilerPass from "./infrastructure/dependencyInjection/RegisterBotCompilerPass"

/**
 * Kryptopus bundle
 */
export default class Bundle implements BundleInterface
{
    botPaths:Map<string, string>;

    constructor()
    {
        this.botPaths = new Map;
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath():string
    {
        return __dirname;
    }


    /**
     * Install bundle dependencies
     */
    @bind
    async installDependencies(application:Application)
    {
        await this.addPlugins(application);
    }

    @bind
    async addPlugins(application:Application):Promise<void>
    {
        const filePath = `${__dirname}/../config/parameters.yml`;
        const config = configYaml(filePath);

        if (Array.isArray(config.plugins)) {
            for (let name of config.plugins) {
                try {
                    if (typeof name === "string") {
                        this.addPluginByName(application, name);
                    } else if (name && typeof name === "object" && name.hasOwnProperty("name")) {
                        this.addPluginByName(application, name.name);
                    }
                } catch (error) {
                    // An error occurred
                }
            }
        }
    }

    @bind
    addPluginByName(application:Application, name:string):void
    {
        const packageConfigPath = require.resolve(`${name}/package.json`);
        const packageConfig = require(packageConfigPath);
        const packagePath = path.dirname(packageConfigPath);

        if (!packageConfig.kryptopus || typeof packageConfig.kryptopus !== "object") {
            console.error(`Unable to add "${name}", it is an invalid plugin`);
            return;
        }
        const config = packageConfig.kryptopus;

        // Add bots
        if (config.hasOwnProperty("bots") && config.bots && typeof config.bots === "object") {
            for (let botName in config.bots) {
                let botRelativePath = config.bots[botName];
                let botAbsolutePath = `${packagePath}/${botRelativePath}`;
                this.botPaths.set(botName, botAbsolutePath);
            }
        }

        //let PluginBundle = require(name);
        //application.addBundle(new PluginBundle);
    }

    @bind
    initialize(application:Application)
    {
        application.on("bundles_booted", () => {
            let container = application.getParameter("serviceContainer");
            let registryDefinition = container.getDefinition("kryptopus_bot_registry");
            for (let botName of this.botPaths.keys()) {
                let botClassPath = this.botPaths.get(botName);
                if (!botClassPath) {
                    continue;
                }

                let botDefinition = new Definition(botName);
                let botOptions = {};
                botDefinition.setClassPath(botClassPath);
                registryDefinition.addMethodCall("addBotDefinition", [
                    botName,
                    botDefinition,
                    botOptions
                ]);
            }
        });
    }

    /**
     * Configure service container
     *
     * @param   {Container}     container   Service container
     */
    configureContainer(container:Container)
    {
        container.addCompilerPass(new RegisterBotCompilerPass());
    }
}
