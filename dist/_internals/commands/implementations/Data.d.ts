import { Coordinates, SelectorArgument } from '@arguments';
import { Command } from '../Command';
declare class DataGet extends Command {
    block: (targetPos: Coordinates, path?: string | undefined, scale?: number | undefined) => void;
    entity: (target: SelectorArgument<true>, path?: string | undefined, scale?: number | undefined) => void;
    storage: (target: string, path?: string | undefined, scale?: number | undefined) => void;
}
declare class DataMerge extends Command {
    block: (targetPos: Coordinates, nbt: string) => void;
    entity: (target: SelectorArgument<true>, nbt: string) => void;
    storage: (target: string, nbt: string) => void;
}
declare class DataModifyValues extends Command {
    fromBlock: (sourcePosition: Coordinates, sourcePath: string) => void;
    fromEntity: (source: SelectorArgument<true>, sourcePath: string) => void;
    fromStorage: (source: string, sourcePath: string) => void;
    value: (value: string) => void;
}
declare class DataModifyType extends Command {
    get append(): DataModifyValues;
    insert: () => DataModifyValues;
    get merge(): DataModifyValues;
    get preprend(): DataModifyValues;
    get set(): DataModifyValues;
}
declare class DataModify extends Command {
    block: (targetPos: Coordinates, targetPath: string) => DataModifyType;
    entity: (target: SelectorArgument<true>, targetPath: string) => DataModifyType;
    storage: (target: string, targetPath: string) => DataModifyType;
}
declare class DataRemove extends Command {
    block: (targetPos: Coordinates, targetPath: string) => void;
    entity: (target: SelectorArgument<true>, targetPath: string) => void;
    storage: (target: string, targetPath: string) => void;
}
export declare class Data extends Command {
    get: DataGet;
    merge: DataMerge;
    modify: DataModify;
    remove: DataRemove;
}
export {};
