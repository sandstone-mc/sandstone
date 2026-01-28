import type { BASIC_COLORS, JSONTextComponent, MultiplePlayersArgumentOf } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { parseJSONText } from 'sandstone/variables/JSONTextComponentClass'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

// Bossbar command
export class BossBarCommandNode extends CommandNode {
  command = 'bossbar' as const
}

export class BossBarCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = BossBarCommandNode

  /**
   * Create a new boss bar.
   *
   * @param id Unique boss bar identifier (namespaced ID).
   *          Examples: 'minecraft:my_bar', 'custom:health', 'mypack:timer'
   *
   * @param name Display name for the boss bar.
   *            Supports JSON text formatting.
   *
   * @example
   * ```ts
   * bossbar.add('custom:health', 'Player Health')
   * bossbar.add('mypack:timer', {text: 'Time Remaining', color: 'red'})
   * ```
   */
  add = (id: Macroable<string, MACRO>, name: Macroable<JSONTextComponent, MACRO>) =>
    this.finalCommand(['add', id, parseJSONText(this.sandstoneCore, name)])

  /**
   * Get boss bar property value.
   *
   * @param id Boss bar identifier to query.
   * @param setting Property to get: 'max', 'players', 'value', or 'visible'.
   *
   * @example
   * ```ts
   * bossbar.get('custom:health', 'value')    // Get current value
   * bossbar.get('mypack:timer', 'max')       // Get maximum value
   * ```
   */
  get = (id: Macroable<string, MACRO>, setting: Macroable<'max' | 'players' | 'value' | 'visible', MACRO>) =>
    this.finalCommand(['get', id, setting])

  /**
   * List all existing boss bars.
   *
   * @example
   * ```ts
   * bossbar.list()    // Show all boss bars
   * ```
   */
  list = () => this.finalCommand(['list'])

  /**
   * Remove a boss bar.
   *
   * @param id Boss bar identifier to remove.
   *
   * @example
   * ```ts
   * bossbar.remove('custom:health')
   * bossbar.remove('mypack:timer')
   * ```
   */
  remove = (id: Macroable<string, MACRO>) => this.finalCommand(['remove', id])

  /**
   * Modify boss bar properties.
   *
   * @param id Boss bar identifier to modify.
   *
   * @example
   * ```ts
   * bossbar.set('custom:health').color('red').max(100).value(75)
   * bossbar.set('mypack:timer').players('@a').visible(true)
   * ```
   */
  set = (id: Macroable<string, MACRO>) => this.subCommand(['set', id], BossBarSetCommand<MACRO>, false)
}

export class BossBarSetCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Set the text color (if no color was specified as part of a text component) and bar color.
   * Defaults to `white` upon creation.
   *
   * @param color The new color.
   */
  color = (color: Macroable<LiteralUnion<BASIC_COLORS>, MACRO>) => this.finalCommand(['color', color])

  /**
   * Set the boss bar's maximum value.
   * Defaults to `100` upon creation.
   *
   * @param max The new maximum value.
   */
  max = (max: Macroable<number, MACRO>) => this.finalCommand(['max', max])

  /**
   * Set the boss bar's name.
   *
   * @param name The new name.
   */
  name = (name: Macroable<string, MACRO>) => this.finalCommand(['name', parseJSONText(this.sandstoneCore, name)])

  /**
   * Change the set of players to whom the bar is visible.
   * Defaults to none upon creation.
   *
   * @param players The new players that will see the bossbar. If not specified, hide the bossbar to all players.
   */
  players = <T extends string>(players?: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>) =>
    this.finalCommand(['players', targetParser(players)])

  /**
   * Set the boss bar's visual amount of segments: continuous, 6 segments, 10 segments, 12 segments, or 20 segments.
   * Defaults to `progress` upon creation.
   *
   * @param style The new style.
   */
  style = (style: Macroable<'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20', MACRO>) =>
    this.finalCommand(['style', style])

  /**
   * Set the boss bar's current value.
   * Defaults to `0` upon creation.
   *
   * @param value The new value.
   */
  value = (value: Macroable<number, MACRO>) => this.finalCommand(['value', value])

  /**
   * Set the boss bar's visibility.
   * Defaults to `true` upon creation.
   *
   * @param visible Whether the bossbar is visible or not.
   */
  visible = (visible: Macroable<boolean, MACRO>) => this.finalCommand(['visible', visible])
}
