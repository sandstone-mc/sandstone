import { Coordinates } from '@arguments';
import { Command } from '@commands/Command';
export declare class Forceload extends Command {
    add: (from: Coordinates, to?: import("../..").VectorClass<[string, string, string]> | [x: string, y: string, z: string] | undefined) => void;
    remove: (from: Coordinates, to?: import("../..").VectorClass<[string, string, string]> | [x: string, y: string, z: string] | undefined) => void;
    removeAll: () => void;
    query: (pos?: import("../..").VectorClass<[string, string, string]> | [x: string, y: string, z: string] | undefined) => void;
}
