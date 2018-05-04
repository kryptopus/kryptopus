/* @flow */
import {bind} from "decko"
import path from "path"
import fs from "fs"
import colors from "colors/safe"
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
    /**
     * Bot paths
     */
    botPaths:Map<string, string>;

    /**
     * Constructor
     */
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
     *
     * @param   {Application}   application     Solfege application
     */
    @bind
    async installDependencies(application:Application):Promise<void>
    {
        await this.addPlugins(application);
    }

    /**
     * Add plugins from parameters.yml
     *
     * @param   {Application}   application     Solfege application
     */
    @bind
    async addPlugins(application:Application):Promise<void>
    {
        // Load parameters.yml
        let config = {};
        const filePath = `${__dirname}/../config/parameters.yml`;
        if (!fs.existsSync(filePath)) {
            return;
        }
        try {
            config = configYaml(filePath);
        } catch (yamlError) {
            console.error(colors.bgRed.white("Invalid parameters.yml"));
            console.error(yamlError.message);
            return;
        }

        // Add plugins
        if (Array.isArray(config.plugins)) {
            for (let plugin of config.plugins) {
                let pluginName = null;
                if (typeof plugin === "string") {
                    pluginName = plugin;
                } else if (plugin && typeof plugin === "object" && plugin.hasOwnProperty("name")) {
                    pluginName = plugin.name;
                }
                if (!pluginName) {
                    continue;
                }
                try {
                    this.addPluginByName(application, pluginName);
                } catch (error) {
                    // An error occurred
                    //console.error(colors.bgRed.white(`Unable to add plugin "${pluginName}"`));
                    //console.error(error.message);
                }
            }
        }
    }

    /**
     * Add a plugin by its name
     *
     * @param   {Application}   application     Solfege application
     * @param   {string}        name            NodeJS package name
     */
    @bind
    addPluginByName(application:Application, name:string):void
    {
        const packageConfigPath = require.resolve(`${name}/package.json`);
        const packageConfig = require(packageConfigPath);
        const packagePath = path.dirname(packageConfigPath);

        // Check "kryptopus" property in package.json
        if (packageConfig.kryptopus && typeof packageConfig.kryptopus === "object") {
            const config = packageConfig.kryptopus;

            // Add bots
            if (config.hasOwnProperty("bots") && config.bots && typeof config.bots === "object") {
                for (let botName in config.bots) {
                    let botRelativePath = config.bots[botName];
                    let botAbsolutePath = `${packagePath}/${botRelativePath}`;
                    this.botPaths.set(botName, botAbsolutePath);
                }
            }
        }

        // Add Solfege bundle if possible
        const PluginBundle = require(name);
        if (typeof PluginBundle === "function") {
            try {
                const bundle = new PluginBundle;
                application.addBundle(bundle);
            } catch (error) {
                // Unable to add bundle
            }
        }
    }

    /**
     * Initialize the bundle
     *
     * @param   {Application}   application     Solfege application
     */
    @bind
    initialize(application:Application)
    {
        application.on("bundles_booted", () => {
            let container = application.getParameter("serviceContainer");

            // Register bots
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
