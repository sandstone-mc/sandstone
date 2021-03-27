import type { GAMEMODES } from 'src/arguments/basics'
import type { NumberOrMinMax } from './utils'

export type PlayerCriterion = Partial<{
  /** A map of advancements to check. */
  advancements: Record<string, boolean | Record<string, boolean>>

  /** The game mode of the player. Must be survival, adventure, creative or spectator. */
  gamemode: GAMEMODES

  /** The experience level of the player. */
  level: NumberOrMinMax

  /** Map of recipes to check. */
  recipes: Record<string, boolean>

  /**
   * List of statistics to match.
   *
   * Note that unlike when adding scoreboard objectives, the base (for example, `minecraft:custom`)
   * and the statistic (for example, `minecraft:sneak_time`) are split and use proper namespaces
   * instead of the dot-notation.
   *
   * For example, the `minecraft.custom:minecraft.sneak_time` corresponds to
   * `base: 'mineecraft:custom'` and `stat: 'minecraft:sneak_time'`.
   */
  stats: {
    /**
     * The statistic base.
     */
    type: (
      'minecraft:custom' |
      'minecraft:crafted' |
      'minecraft:used' |
      'minecraft:broken' |
      'minecraft:mined' |
      'minecraft:killed' |
      'minecraft:picked_up' |
      'minecraft:dropped' |
      'minecraft:killed_by'
    )

    /** The statistic ID. Mostly mimics the criteria used for defining scoreboard objectives. */
    stat: string

    /** The value of the statistic. */
    value: NumberOrMinMax
  }
}>
