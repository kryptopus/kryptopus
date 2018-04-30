/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"
import type DomainExecuteBot from "../../domain/bot/command/ExecuteBot"

/**
 * Run a bot
 */
export default class ExecuteBot extends ContainerAwareCommand
{
    /**
     * Execute bot command from domain
     */
    domainCommand:DomainExecuteBot;

    /**
     * Constructor
     *
     * @param   {DomainExecuteBot}  domainCommand   Execute bot command from domain
     */
    constructor(domainCommand:DomainExecuteBot)
    {
        super();

        this.domainCommand = domainCommand;
    }

    /**
     * Configure the command
     */
    async configure()
    {
        this.setName("bot:execute");
        this.setDescription("Execute a bot");
    }

    /**
     * Execute the command
     */
    async execute(parameters:Array<string>)
    {
        if (parameters.length <= 0) {
            throw new Error("Please provide a bot name");
        }

        const name = parameters.shift();

        await this.domainCommand.execute(name);
    }
}
