/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"

/**
 * Start the daemon
 */
export default class StartDaemon extends ContainerAwareCommand
{
    website:any;
    websitePort:number;

    /**
     * Constructor
     */
    constructor(website:any, websitePort:number)
    {
        super();

        this.website = website;
        this.websitePort = websitePort;
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
        this.website.listen(this.websitePort);
    }
}
