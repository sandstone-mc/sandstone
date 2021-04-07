import { MultipleEntitiesArgument } from 'src/arguments'
import { JSONTextComponentClass } from '@variables'

import { Command } from '../Command'
import { command } from '../decorators'

import type { BASIC_COLORS, JSONTextComponent, MultiplePlayersArgument } from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'

export class Bossbar extends Command {
  /**
   * Create a new boss bar.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @param name The display name of the boss bar.
   */
  @command(['bossbar', 'add'], { isRoot: true, parsers: { '1': (arg) => new JSONTextComponentClass(arg) } })
  add = (id: string, name: JSONTextComponent) => { }

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
   * Set some bossbar options.
   *
   * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
   *
   * @example
   * bossbar.set('custom:mybossbar').color('red')
   */
  @command(['bossbar', 'set'], { isRoot: true, executable: false, hasSubcommands: true })
  set = (id: string) => new BossbarSet(this.commandsRoot)
}

class BossbarSet extends Command {
  /**
   * Set the text color (if no color was specified as part of a text component) and bar color.
   * Defaults to `white` upon creation.
   *
   * @param color The new color.
   */
  @command('color', { isRoot: true })
  color = (color: LiteralUnion<BASIC_COLORS>) => { }

  /**
   * Set the boss bar's maximum value.
   * Defaults to `100` upon creation.
   *
   * @param max The new maximum value.
   */
  @command('max', { isRoot: true })
  max = (max: number) => { }

  /**
   * Set the boss bar's name.
   *
   * @param name The new name.
   */
  @command('name', { isRoot: true })
  name = (name: string) => { }

  /**
   * Change the set of players to whom the bar is visible.
   * Defaults to none upon creation.
   *
   * @param players The new players that will see the bossbar. If not specified, hide the bossbar to all players.
   */
  @command('players', { isRoot: true })
  players = (players?: MultiplePlayersArgument) => { }

  /**
   * Set the boss bar's visual amount of segments: continuous, 6 segments, 10 segments, 12 segments, or 20 segments.
   * Defaults to `progress` upon creation.
   *
   * @param style The new style.
   */
  @command('style', { isRoot: true })
  style = (style: 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20') => { }

  /**
   * Set the boss bar's current value.
   * Defaults to `0` upon creation.
   *
   * @param value The new value.
   */
  @command('value', { isRoot: true })
  value = (value: number) => { }

  /**
   * Set the boss bar's visibility.
   * Defaults to `true` upon creation.
   *
   * @param visible Whether the bossbar is visible or not.
   */
  @command('visible', { isRoot: true })
  visible = (visible: number) => { }
}
