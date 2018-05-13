/* @flow */
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"
import ExecuteBotCommand from "../../domain/bot/command/ExecuteBot"
import type ExecuteBotHandler from "../../domain/bot/commandHandler/ExecuteBot"

/**
 * Run a bot
 */
export default class ExecuteBot extends ContainerAwareCommand
{
    /**
     * Handler of the command
     */
    handler:ExecuteBotHandler;

    /**
     * Constructor
     *
     * @param   {ExecuteBotHanler}  handler     Handler of the command
     */
    constructor(handler:ExecuteBotHandler)
    {
        super();

        this.handler = handler;
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
        const command = new ExecuteBotCommand(name);

        await this.handler.handle(command);
    }
}
