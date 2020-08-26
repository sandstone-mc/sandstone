import type { CommandsRoot } from './CommandsRoot';
export declare abstract class Command {
    protected commandsRoot: CommandsRoot;
    constructor(commandsRoot: CommandsRoot);
}
