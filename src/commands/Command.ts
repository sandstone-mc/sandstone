import type CommandsRoot from "./CommandsRoot";

export abstract class Command {
    protected commandsRoot: CommandsRoot

    constructor(commandsRoot: CommandsRoot) {
        this.commandsRoot = commandsRoot
    }
}