import { BLOCKS, Coordinates } from '@arguments';
import { LiteralUnion } from '@/generalTypes';
import { Command } from '../Command';
export declare class CloneOptions extends Command {
    replace: (mode: 'force' | 'move' | 'normal') => void;
    masked: (mode: 'force' | 'move' | 'normal') => void;
    filtered: (filter: LiteralUnion<BLOCKS>, mode: 'force' | 'move' | 'normal') => void;
}
export declare class Clone extends Command {
    clone: (begin: Coordinates, end: Coordinates, destination: Coordinates) => CloneOptions;
}
