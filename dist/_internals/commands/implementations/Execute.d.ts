import { LiteralUnion } from '@/generalTypes';
import { ANCHORS, AXES, BLOCKS, COMPARISON_OPERATORS, Coordinates, DIMENSION_TYPES, ObjectiveArgument, Rotation, SelectorArgument } from '@arguments';
import { MinecraftCondition } from '@arguments/condition';
import { Range } from '@variables';
import { PlayerScore } from '@variables/PlayerScore';
import type * as commands from '../../../commands';
import { Command } from '../Command';
import type { CommandsRoot } from '../CommandsRoot';
declare type StoreType = 'byte' | 'short' | 'int' | 'long' | 'float' | 'double';
export declare class ExecuteStoreArgs extends Command {
    block: (targetPos: Coordinates, path: string, type: StoreType, scale: number) => Execute;
    bossbar: (id: string, type: 'max' | 'value') => Execute;
    entity: (target: SelectorArgument<true>, path: string, type: StoreType, scale: number) => Execute;
    score: (((targets: SelectorArgument<false>, objective: ObjectiveArgument) => Execute) & ((playerScore: PlayerScore) => Execute));
    storage: (target: string, path: string, type: StoreType, scale: number) => Execute;
}
export declare class ExecuteStore extends Command {
    get result(): ExecuteStoreArgs;
    get success(): ExecuteStoreArgs;
}
export declare class ExecuteIfData extends Command {
    block: (pos: Coordinates, path: string) => Execute;
    entity: (target: SelectorArgument<true>, path: string) => Execute;
    storage: (source: string, path: string) => Execute;
}
export declare class Execute extends Command {
    align: (axes: AXES) => this;
    anchored: (anchor: ANCHORS) => this;
    as: (targets: SelectorArgument<false>) => this;
    at: (targets: SelectorArgument<false>) => this;
    facing: (pos: Coordinates) => this;
    facingEntity: (targets: SelectorArgument<false>, anchor: ANCHORS) => this;
    in: (dimension: DIMENSION_TYPES) => this;
    positioned: (pos: Coordinates) => this;
    positionedAs: (targets: SelectorArgument<false>) => this;
    rotated: (rotation: Rotation) => this;
    rotatedAs: (targets: SelectorArgument<false>) => this;
    ifBlock: (pos: Coordinates, block: LiteralUnion<BLOCKS>) => this;
    unlessBlock: this['ifBlock'];
    ifBlocks: (start: Coordinates, end: Coordinates, destination: Coordinates, scanMode: 'all' | 'masked') => this;
    unlessBlocks: this['ifBlocks'];
    get ifData(): ExecuteIfData;
    get unlessData(): ExecuteIfData;
    ifEntity: (targets: SelectorArgument<false>) => this;
    unlessEntity: this['ifEntity'];
    ifScore: (((target: SelectorArgument<true>, targetObjective: ObjectiveArgument, operator: COMPARISON_OPERATORS, source: SelectorArgument<true>, sourceObjective: ObjectiveArgument) => Execute) & ((target: SelectorArgument<true>, targetObjective: ObjectiveArgument, operator: 'matches', range: Range) => Execute));
    unlessScore: this['ifScore'];
    ifPredicate: (predicate: string) => this;
    unlessPredicate: this['ifPredicate'];
    private if_;
    private unless_;
    if: (condition: MinecraftCondition) => this;
    unless: (condition: MinecraftCondition) => this;
    store: ExecuteStore;
    get runOne(): Pick<CommandsRoot, ((keyof typeof commands) | 'function')>;
    run: (callback: () => void) => void;
}
export {};
