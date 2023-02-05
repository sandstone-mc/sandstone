import { CommandNode } from '#core/nodes'
import { JSONTextComponentClass } from '#variables'

import { CommandArguments } from '../helpers.js'

import type { BASIC_COLORS, JSONTextComponent, MultiplePlayersArgument } from '#arguments'
import type { LiteralUnion } from '#utils'

// Bossbar command
export class BossBarCommandNode extends CommandNode {
  command = 'bossbar' as const
}

export class BossBarCommand extends CommandArguments {
  protected NodeType = BossBarCommandNode

  /**
   * Create a new boss bar.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param name The display name of the boss bar.
   */
  add = (id: string, name: JSONTextComponent) => this.finalCommand(['add', id, new JSONTextComponentClass(name)])

  /**
   * Return the requested setting as a result of the command.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   */
  get = (id: string, setting: 'max' | 'players' | 'value' | 'visible') => this.finalCommand(['get', id, setting])

  /**
   * Display a list of existing boss bars.
   */
  list = () => this.finalCommand(['list'])

  /**
   * Remove an existing bossbar.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   */
  remove = (id: string) => this.finalCommand(['remove', id])

  /**
   * Set some bossbar options.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @example
   * bossbar.set('custom:mybossbar').color('red')
   */
  set = (id: string) => this.subCommand(['set', id], BossBarSetCommand, false)
}

export class BossBarSetCommand extends CommandArguments {
  /**
   * Set the text color (if no color was specified as part of a text component) and bar color.
   * Defaults to `white` upon creation.
   *
   * @param color The new color.
   */
  color = (color: LiteralUnion<BASIC_COLORS>) => this.finalCommand(['color', color])

  /**
   * Set the boss bar's maximum value.
   * Defaults to `100` upon creation.
   *
   * @param max The new maximum value.
   */
  max = (max: number) => this.finalCommand(['max', max])

  /**
   * Set the boss bar's name.
   *
   * @param name The new name.
   */
  name = (name: string) => this.finalCommand(['name', name])

  /**
   * Change the set of players to whom the bar is visible.
   * Defaults to none upon creation.
   *
   * @param players The new players that will see the bossbar. If not specified, hide the bossbar to all players.
   */
  players = (players?: MultiplePlayersArgument) => this.finalCommand(['players', players])

  /**
   * Set the boss bar's visual amount of segments: continuous, 6 segments, 10 segments, 12 segments, or 20 segments.
   * Defaults to `progress` upon creation.
   *
   * @param style The new style.
   */
  style = (style: 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20') => this.finalCommand(['style', style])

  /**
   * Set the boss bar's current value.
   * Defaults to `0` upon creation.
   *
   * @param value The new value.
   */
  value = (value: number) => this.finalCommand(['value', value])

  /**
   * Set the boss bar's visibility.
   * Defaults to `true` upon creation.
   *
   * @param visible Whether the bossbar is visible or not.
   */
  visible = (visible: boolean) => this.finalCommand(['visible', visible])
}
