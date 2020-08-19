import { SelectorArgument } from '@arguments';
import { Command } from '@commands/Command';
declare class AdvancementArguments extends Command {
    everything: () => void;
    only: (advancement: string, criterion: string) => void;
    from: (advancement: string) => void;
    through: (advancement: string) => void;
    until: (advancement: string) => void;
}
export declare class Advancement extends Command {
    grant: (targets: SelectorArgument<false>) => AdvancementArguments;
    revoke: (targets: SelectorArgument<false>) => AdvancementArguments;
}
export {};
