import type { MultipleEntitiesArgument } from 'sandstone/arguments'
import { validateIntegerRange } from 'sandstone/commands/validators'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class EffectCommandNode extends CommandNode {
  command = 'effect' as const
}

export class EffectCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = EffectCommandNode

  /**
   * Apply a status effect to entities.
   * 
   * Grants the specified effect to all targeted entities with customizable
   * duration, strength, and visibility. Effects modify entity behavior,
   * attributes, and capabilities while active.
   * 
   * **Effect Categories:**
   * - **Beneficial:** speed, strength, regeneration, resistance, fire_resistance
   * - **Harmful:** poison, weakness, slowness, mining_fatigue, blindness
   * - **Neutral:** night_vision, water_breathing, invisibility, glowing
   * - **Instant:** instant_health, instant_damage (duration in ticks, not seconds)
   * 
   * **Duration Rules:**
   * - Most effects: duration in seconds (1-1,000,000)
   * - Instant effects: duration in ticks (typically 1-20)
   * - 'infinite': permanent until manually removed
   * - 0: removes the effect (same as clear)
   *
   * @param targets Entities to apply the effect to.
   *               Examples: '@p', '@a', '@e[type=zombie]', 'PlayerName'
   *
   * @param effect The status effect to apply.
   *              Examples: 'minecraft:speed', 'minecraft:poison', 'minecraft:strength'
   *
   * @param seconds Effect duration in seconds (0-1,000,000) or 'infinite'.
   *               Defaults to 30 seconds for most effects.
   *               For instant effects (instant_health, instant_damage), this is ticks.
   *
   * @param amplifier Effect strength level (0-based).
   *                 0 = Level I, 1 = Level II, 2 = Level III, etc.
   *                 Higher levels increase effect potency.
   *                 Maximum level is 127.
   *                 Defaults to 0 (Level I).
   *
   * @param hideParticles Whether to hide effect particles and HUD indicators.
   *                     true = invisible effect, false = visible particles.
   *                     Defaults to false (particles visible).
   * 
   * @example
   * ```ts
   * // Basic effect application
   * effect.give('@p', 'minecraft:speed', 60)              // Speed I for 1 minute
   * effect.give('@a', 'minecraft:night_vision', 300)      // Night vision for 5 minutes
   * 
   * // Effects with custom amplifiers
   * effect.give('@p', 'minecraft:strength', 120, 2)       // Strength III for 2 minutes
   * effect.give('@e[type=zombie]', 'minecraft:slowness', 60, 1) // Slowness II
   * 
   * // Hidden effects (no particles)
   * effect.give('@p', 'minecraft:invisibility', 180, 0, true) // Invisible invisibility
   * effect.give('@a[team=stealth]', 'minecraft:speed', 300, 1, true) // Hidden speed
   * 
   * // Permanent effects
   * effect.give('@e[tag=boss]', 'minecraft:resistance', 'infinite', 4) // Permanent resistance V
   * 
   * // Instant effects (duration in ticks)
   * effect.give('@p', 'minecraft:instant_health', 1, 5)   // Instant heal (massive)
   * effect.give('@e[type=zombie]', 'minecraft:instant_damage', 1, 2) // Instant damage III
   * 
   * // Area effects
   * effect.give('@a[distance=..20]', 'minecraft:absorption', 600, 3) // Area buff
   * effect.give('@e[type=#minecraft:hostile,distance=..15]', 'minecraft:glowing', 120) // Mark enemies
   * ```
   */
  give = (
    targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
    effect: Macroable<Registry['minecraft:mob_effect'], MACRO>,
    seconds?: number | 'infinite',
    amplifier?: number,
    hideParticles?: boolean,
  ) => {
    if (seconds && seconds !== 'infinite') validateIntegerRange(seconds, 'seconds', 0, 1_000_000)
    if (amplifier) validateIntegerRange(amplifier, 'amplifier', 0, 127)
    return this.finalCommand(['give', targetParser(targets), effect, seconds, amplifier, hideParticles])
  }

  /**
   * Remove status effects from entities.
   * 
   * Removes specific effects or clears all active effects from the targeted entities.
   * Useful for cleansing debuffs, ending temporary abilities, or resetting entity states.
   * 
   * **Removal Behavior:**
   * - Instantly removes specified effects regardless of remaining duration
   * - Can target specific effects or clear everything
   * - Works on all effect types including permanent effects
   * - No items or experience are dropped
   * 
   * @param targets Optional entities to remove effects from.
   *               Defaults to command executor (@s) if not specified.
   *               Examples: '@p', '@a', '@e[type=villager]', 'PlayerName'
   *
   * @param effect Optional specific effect to remove.
   *              If not specified, removes ALL active effects.
   *              Examples: 'minecraft:poison', 'minecraft:slowness'
   * 
   * @example
   * ```ts
   * // Clear all effects from yourself
   * effect.clear()
   * 
   * // Clear all effects from specific player
   * effect.clear('PlayerName')
   * 
   * // Clear all effects from all players
   * effect.clear('@a')
   * 
   * // Remove specific effect from player
   * effect.clear('@p', 'minecraft:poison')        // Remove poison only
   * effect.clear('@a', 'minecraft:slowness')      // Remove slowness from all
   * 
   * // Clear debuffs from team members
   * effect.clear('@a[team=blue]', 'minecraft:weakness')
   * effect.clear('@a[team=blue]', 'minecraft:mining_fatigue')
   * 
   * // Emergency cleanse (remove all negative effects)
   * effect.clear('@p')  // Nuclear option - removes everything
   * ```
   */
  clear = (
    targets?: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
    effect?: Macroable<Registry['minecraft:mob_effect'], MACRO>,
  ) => this.finalCommand(['clear', targetParser(targets), effect])
}
