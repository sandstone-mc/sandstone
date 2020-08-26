import { LiteralUnion } from '@/generalTypes';
import { MOB_EFFECTS, SelectorArgument } from '@arguments';
import { Command } from '@commands/Command';
export declare class Effect extends Command {
    give: (targets: SelectorArgument<false>, effect: LiteralUnion<MOB_EFFECTS>, seconds: number, amplifier: number, hideParticles: boolean) => void;
    clear: (targets?: string | import("../..").SelectorClass<true> | import("../..").SelectorClass<false> | undefined, effect?: "minecraft:wither" | (string & {}) | "minecraft:speed" | "minecraft:slowness" | "minecraft:haste" | "minecraft:mining_fatigue" | "minecraft:strength" | "minecraft:instant_health" | "minecraft:instant_damage" | "minecraft:jump_boost" | "minecraft:nausea" | "minecraft:regeneration" | "minecraft:resistance" | "minecraft:fire_resistance" | "minecraft:water_breathing" | "minecraft:invisibility" | "minecraft:blindness" | "minecraft:night_vision" | "minecraft:hunger" | "minecraft:weakness" | "minecraft:poison" | "minecraft:health_boost" | "minecraft:absorption" | "minecraft:saturation" | "minecraft:glowing" | "minecraft:levitation" | "minecraft:luck" | "minecraft:unluck" | "minecraft:slow_falling" | "minecraft:conduit_power" | "minecraft:dolphins_grace" | "minecraft:bad_omen" | "minecraft:hero_of_the_village" | undefined) => void;
}
