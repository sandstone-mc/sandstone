import { LiteralUnion } from '@/generalTypes';
import { Coordinates, SelectorArgument } from '@arguments';
import { Command } from '@commands/Command';
declare class LootSource extends Command {
    fish: (lootTable: string, pos: Coordinates, tool: LiteralUnion<'mainhand' | 'offhand'>) => void;
    loot: (lootTable: string) => void;
    kill: (target: SelectorArgument<true>) => void;
    mine: (pos: Coordinates, tool: LiteralUnion<'mainhand' | 'offhand'>) => void;
}
export declare class Loot extends Command {
    spawn: (targetPos: Coordinates) => LootSource;
    replaceEntity: (entities: SelectorArgument<false>, slot: string, count?: number | undefined) => LootSource;
    replaceBlock: (targetPos: Coordinates, slot: string, count?: number | undefined) => LootSource;
    give: (players: SelectorArgument<false>) => LootSource;
    insert: (targetPos: Coordinates) => LootSource;
}
export {};
