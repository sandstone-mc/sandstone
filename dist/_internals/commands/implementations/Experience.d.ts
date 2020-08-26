import { SelectorArgument } from '@arguments';
import { Command } from '@commands/Command';
export declare class Experience extends Command {
    add: (targets: SelectorArgument<false>, amount: number, type?: "level" | "points" | undefined) => void;
    set: (targets: SelectorArgument<false>, amount: number, type?: "level" | "points" | undefined) => void;
    query: (targets: SelectorArgument<false>, type?: "level" | "points" | undefined) => void;
}
