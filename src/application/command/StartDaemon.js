/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"

/**
 * Start the daemon
 */
export default class StartDaemon extends ContainerAwareCommand
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
    }

    /**
     * Configure the command
     */
    async configure()
    {
        this.setName("daemon:start");
        this.setDescription("Start the daemon");
    }

    /**
     * Execute the command
     */
    async execute(parameters:Array<string>)
    {
    }
}
