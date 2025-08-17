import type { SingleEntityArgument, SinglePlayerArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class SpectateCommandNode extends CommandNode {
  command = 'spectate' as const
}

export class SpectateCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SpectateCommandNode

  /**
   * Make a spectator player follow an entity.
   *
   * @param target Entity to spectate.
   *              Examples: '@p', '@e[type=zombie,limit=1]', 'PlayerName'
   *
   * @param player Optional spectator player. Defaults to command executor.
   *              Examples: '@p', 'SpectatorName'
   *
   * @example
   * ```ts
   * spectate('@e[type=zombie,limit=1]')        // You spectate nearest zombie
   * spectate('@p', 'SpectatorPlayer')          // SpectatorPlayer spectates nearest player
   * spectate('@e[type=villager,limit=1]', '@p') // Nearest player spectates villager
   * ```
   */
  spectate = (
    target: Macroable<SingleEntityArgument<MACRO>, MACRO>,
    player?: Macroable<SinglePlayerArgument<MACRO>, MACRO>,
  ) => this.finalCommand([targetParser(target), player])
}
