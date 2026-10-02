import type { Coordinates, MultipleEntitiesArgument } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments, type FinalCommandOutput } from '../../commands/helpers'

export class DummyCommandNode extends CommandNode<[string]> {
  command = 'dummy' as const

  readonly testExclusive: boolean = true
}

/**
 * Controls a PackTest dummy player. Dummies are fake players that don't
 * save or load data from disk and don't load a skin.
 *
 * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
 *
 * @example
 * ```ts
 * Test.dummy('tester').spawn()
 * Test.dummy('tester').jump()
 * Test.dummy('tester').sneak(true)
 * Test.dummy('tester').use.block(abs(0, 64, 0))
 * Test.dummy('tester').attack('@e[type=zombie]')
 * ```
 */
export class DummyCommand extends CommandArguments {
  protected NodeType = DummyCommandNode

  /**
   * Select a dummy by name and chain into an action.
   *
   * @param name Name of the dummy player.
   */
  dummy = (name: string) => this.subCommand([name], DummyActionCommand, false)
}

/**
 * Action subcommands for a previously-selected dummy.
 */
export class DummyActionCommand extends CommandArguments {
  /** Spawns a new dummy. */
  spawn = (): FinalCommandOutput => this.finalCommand(['spawn'])

  /** Respawns the dummy after it has been killed. */
  respawn = (): FinalCommandOutput => this.finalCommand(['respawn'])

  /** Makes the dummy leave the server. */
  leave = (): FinalCommandOutput => this.finalCommand(['leave'])

  /** Makes the dummy jump, if currently on the ground. */
  jump = (): FinalCommandOutput => this.finalCommand(['jump'])

  /**
   * Makes the dummy hold shift or un-shift.
   *
   * Note: this is not the same as currently crouching.
   *
   * @param state Whether to start sneaking. Defaults to `true`.
   */
  sneak = (state: boolean = true) => this.finalCommand(['sneak', state])

  /**
   * Makes the dummy sprint or un-sprint.
   *
   * @param state Whether to start sprinting. Defaults to `true`.
   */
  sprint = (state: boolean = true) => this.finalCommand(['sprint', state])

  /**
   * Makes the dummy drop the current mainhand item.
   *
   * @param all If `'all'`, drops the entire stack. Otherwise drops a single item.
   */
  drop = (all?: 'all') => this.finalCommand(['drop', all])

  /** Makes the dummy swap its mainhand and offhand. */
  swap = (): FinalCommandOutput => this.finalCommand(['swap'])

  /** Makes the dummy select a different hotbar slot. */
  selectslot = (): FinalCommandOutput => this.finalCommand(['selectslot'])

  /**
   * Makes the dummy attack an entity with its mainhand.
   *
   * @param entity Entity to attack.
   */
  attack = (entity: MultipleEntitiesArgument) =>
    this.finalCommand(['attack', targetParser(entity)])

  /**
   * Makes the dummy mine a block.
   *
   * @param pos Position of the block to mine.
   */
  mine = (pos: Coordinates) => this.finalCommand(['mine', coordinatesParser(pos)])

  /**
   * Makes the dummy use its hand item (mainhand or offhand).
   */
  get use(): DummyUseCommand {
    return new DummyUseCommand(this.sandstonePack, false, this.previousNode)
  }
}

/**
 * Action subcommands for `dummy <name> use ...`.
 */
export class DummyUseCommand extends CommandArguments {
  /** Makes the dummy use its hand item (mainhand or offhand). */
  item = (): FinalCommandOutput => this.finalCommand(['item'])

  /**
   * Makes the dummy use its hand item on a block position.
   */
  get block(): DummyUseBlockCommand {
    return new DummyUseBlockCommand(this.sandstonePack, false, this.previousNode)
  }

  /**
   * Makes the dummy use its hand item on an entity.
   *
   * @param entity Entity to interact with.
   */
  entity = (entity: MultipleEntitiesArgument) =>
    this.finalCommand(['entity', targetParser(entity)])
}

export class DummyUseBlockCommand extends CommandArguments {
  block = (
    pos: Coordinates,
    direction?: LiteralUnion<'up' | 'down' | 'north' | 'south' | 'east' | 'west'>,
  ) => this.finalCommand([coordinatesParser(pos), direction])
}