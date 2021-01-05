import { MultipleEntitiesArgument } from '@arguments'
import { JsonTextComponentClass } from '@variables'

import { Command } from '../Command'
import { command } from '../decorators'

import type { LiteralUnion } from '@/generalTypes'
import type { BASIC_COLORS, JsonTextComponent, MultiplePlayersArgument } from '@arguments'

export class Bossbar extends Command {
  /**
   * Create a new boss bar.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param name The display name of the boss bar.
   */
  @command(['bossbar', 'add'], { isRoot: true, parsers: { '1': (arg) => new JsonTextComponentClass(arg) } })
  add = (id: string, name: JsonTextComponent) => { }

  /**
   * Return the requested setting as a result of the command.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   */
  @command(['bossbar', 'get'], { isRoot: true })
  get = (id: string, setting: 'max' | 'players' | 'value' | 'visible') => { }

  /**
   * Display a list of existing boss bars.
   */
  @command(['bossbar', 'list'], { isRoot: true })
  list = () => { }

  /**
   * Remove an existing bossbar.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   */
  @command(['bossbar', 'remove'], { isRoot: true })
  remove = (id: string) => { }

  /**
   * Set the text color (if no color was specified as part of a text component) and bar color.
   * Defaults to `white` upon creation.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param color The new color.
   */
  @command(['bossbar', 'set', 'color'], { isRoot: true })
  setColor = (id: string, color: LiteralUnion<BASIC_COLORS>) => { }

  /**
   * Set the boss bar's maximum value.
   * Defaults to `100` upon creation.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param max The new maximum value.
   */
  @command(['bossbar', 'set', 'max'], { isRoot: true })
  setMax = (id: string, max: number) => { }

  /**
   * Set the boss bar's name.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param name The new name.
   */
  @command(['bossbar', 'set', 'name'], { isRoot: true })
  setName = (id: string, name: string) => { }

  /**
   * Change the set of players to whom the bar is visible.
   * Defaults to none upon creation.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param players The new players that will see the bossbar. If not specified, hide the bossbar to all players.
   */
  @command(['bossbar', 'set', 'players'], { isRoot: true })
  setPlayers = (id: string, players?: MultiplePlayersArgument) => { }

  /**
   * Set the boss bar's visual amount of segments: continuous, 6 segments, 10 segments, 12 segments, or 20 segments.
   * Defaults to `progress` upon creation.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param style The new style.
   */
  @command(['bossbar', 'set', 'style'], { isRoot: true })
  setStyle = (id: string, style: 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20') => { }

  /**
   * Set the boss bar's current value.
   * Defaults to `0` upon creation.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param value The new value.
   */
  @command(['bossbar', 'set', 'value'], { isRoot: true })
  setValue = (id: string, value: number) => { }

  /**
   * Set the boss bar's visibility.
   * Defaults to `true` upon creation.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param visible Whether the bossbar is visible or not.
   */
  @command(['bossbar', 'set', 'visible'], { isRoot: true })
  setVisible = (id: string, visible: number) => { }
}
