import { CommandNode } from 'sandstone/core/nodes'
import { parseJSONText } from 'sandstone/variables/JSONTextComponentClass'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { BASIC_COLORS, JSONTextComponent, MultiplePlayersArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'

// Bossbar command
export class BossBarCommandNode extends CommandNode {
  command = 'bossbar' as const
}

export class BossBarCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = BossBarCommandNode

  /**
   * Create a new boss bar.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param name The display name of the boss bar.
   */
  add = (id: Macroable<string, MACRO>, name: Macroable<JSONTextComponent, MACRO>) => this.finalCommand(['add', id, parseJSONText(this.sandstoneCore, name)])

  /**
   * Return the requested setting as a result of the command.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   */
  get = (id: Macroable<string, MACRO>, setting: Macroable<'max' | 'players' | 'value' | 'visible', MACRO>) => this.finalCommand(['get', id, setting])

  /**
   * Display a list of existing boss bars.
   */
  list = () => this.finalCommand(['list'])

  /**
   * Remove an existing bossbar.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   */
  remove = (id: Macroable<string, MACRO>) => this.finalCommand(['remove', id])

  /**
   * Set some bossbar options.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @example
   * bossbar.set('custom:mybossbar').color('red')
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
  name = (name: Macroable<string, MACRO>) => this.finalCommand(['name', name])

  /**
   * Change the set of players to whom the bar is visible.
   * Defaults to none upon creation.
   *
   * @param players The new players that will see the bossbar. If not specified, hide the bossbar to all players.
   */
  players = (players?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) => this.finalCommand(['players', targetParser(players)])

  /**
   * Set the boss bar's visual amount of segments: continuous, 6 segments, 10 segments, 12 segments, or 20 segments.
   * Defaults to `progress` upon creation.
   *
   * @param style The new style.
   */
  style = (style: Macroable<'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20', MACRO>) => this.finalCommand(['style', style])

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
