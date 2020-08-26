import { LiteralUnion } from '@/generalTypes';
import { BLOCKS, Coordinates, ITEMS, PARTICLE_TYPES, SelectorArgument } from '@arguments';
import { Command } from '@commands/Command';
declare type ParticleCommand = ((
/** Normal case */
(name: Exclude<PARTICLE_TYPES, 'minecraft:dust' | 'minecraft:block' | 'minecraft:falling_dust' | 'minecraft:item'>, pos?: Coordinates, delta?: [deltaX: number, deltaY: number, deltaZ: number], speed?: number, count?: number, mode?: 'force' | 'normal', viewers?: SelectorArgument<false>) => void) & (
/** Dust parameters */
(name: 'minecraft:dust', colors: [red: number, green: number, blue: number, size: number], pos?: Coordinates, delta?: [deltaX: number, deltaY: number, deltaZ: number], speed?: number, count?: number, mode?: 'force' | 'normal', viewers?: SelectorArgument<false>) => void) & (
/** Block / falling dust parameters */
(name: 'minecraft:block' | 'minecraft:falling_dust', block: LiteralUnion<BLOCKS>, pos?: Coordinates, delta?: [deltaX: number, deltaY: number, deltaZ: number], speed?: number, count?: number, mode?: 'force' | 'normal', viewers?: SelectorArgument<false>) => void) & (
/** Item parameters */
(name: 'minecraft:item', item: LiteralUnion<ITEMS>, pos?: Coordinates, delta?: [deltaX: number, deltaY: number, deltaZ: number], speed?: number, count?: number, mode?: 'force' | 'normal', viewers?: SelectorArgument<false>) => void));
export declare class Particle extends Command {
    particle: ParticleCommand;
}
export {};
