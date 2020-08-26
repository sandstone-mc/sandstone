import type { JsonTextComponent, SelectorArgument } from '@arguments';
import type { CommandsRoot } from '@commands';
import { JsonTextComponentClass } from './JsonTextComponentClass';
import { PlayerScore } from './PlayerScore';
export declare class ObjectiveClass {
    private commandsRoot;
    name: string;
    criterion: string;
    display: JsonTextComponentClass | undefined;
    _displayRaw: JsonTextComponent | undefined;
    constructor(commandsRoot: CommandsRoot, name: string, criterion: string, display?: JsonTextComponent);
    toString(): string;
    ScoreHolder(scoreHolder: SelectorArgument<false>): PlayerScore;
}
export declare function Objective(commandsRoot: CommandsRoot, name: string, criterion: string, display?: JsonTextComponent): ObjectiveClass;
