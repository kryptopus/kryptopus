/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"
import type Configuration from "solfegejs-configuration/lib/Configuration"
import npm from "npm"

/**
 * Install Kryptopus plugins
 */
export default class InstallPlugins extends ContainerAwareCommand
{
    /**
     * Solfege configuration
     */
    config:Configuration;

    /**
     * Constructor
     *
     * @param   {Configuration}     config  Solfege configuration
     */
    constructor(config:Configuration)
    {
        super();

        this.config = config;
    }

    /**
     * Configure the command
     */
    async configure()
    {
        this.setName("plugin:install-all");
        this.setDescription("Install plugins");
    }

    /**
     * Execute the command
     */
    async execute(parameters:Array<string>)
    {
        const plugins = this.config.get("plugins");
        let uris = [];
        for (let name of plugins) {
            if (typeof name === "string") {
                uris.push(name);
            } else if (name && typeof name === "object" && name.hasOwnProperty("url")) {
                uris.push(name.url);
            }
        }

        // Initialize package.json
        const directoryPath = `${__dirname}/../../..`;

        // Install
        npm.load({
            "bin-links": false,
            verbose: false,
            loglevel: "silent",
            save: false,
            "package-lock": false,
            prefix: directoryPath
        }, (err) => {

            npm.commands.install(uris, function (er, data) {
                if (er) {
                    console.log("[ERROR]", er.message);
                    return;
                }
                //console.log("[INSTALL]", data);
            });

            npm.on("log", function (message) {
                //console.log(message);
            });
        });
    }
}
