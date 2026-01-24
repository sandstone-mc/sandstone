import type { ColumnCoordinates, MultipleEntitiesArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'

export class SpreadPlayersNode extends CommandNode {
  command = 'spreadplayers' as const
}

export class SpreadPlayersCommand<MACRO extends boolean> extends CommandArguments<typeof SpreadPlayersNode> {
  protected NodeType = SpreadPlayersNode

  /**
   * Teleports entities to random surface locations within an area.
   *
   * @param center Center coordinates of the spread area (x, z coordinates only).
   *              Examples: [0, 0], [100, -50], rel(10, 20)
   *
   * @param spreadDistance Minimum distance between spread entities.
   *                      Must be positive. Larger values spread entities further apart.
   *
   * @param maxRange Maximum distance from center to spread entities.
   *               Creates a square area of (maxRange * 2) on each side.
   *
   * @param respectTeams Whether to keep teams together when spreading.
   *                   If true, team members teleport to the same location.
   *
   * @param targets Entity selector for targets to spread.
   *              Examples: '@a', '@e[type=player]', '@a[team=red]'
   *
   * @example
   * ```ts
   * // Basic player spreading
   * spreadplayers([0, 0], 5, 100, false, '@a')     // Spread all players randomly
   * spreadplayers([50, -25], 10, 200, true, '@a')  // Keep teams together
   *
   * // Spread specific groups
   * spreadplayers([0, 0], 8, 150, false, '@a[team=hunters]')
   * spreadplayers(rel(0, 0), 3, 50, false, '@e[type=villager]')
   * ```
   */
  spreadplayers(
    center: Macroable<ColumnCoordinates<MACRO>, MACRO>,
    spreadDistance: Macroable<number, MACRO>,
    maxRange: Macroable<number, MACRO>,
    respectTeams: Macroable<boolean, MACRO>,
    targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
  ): FinalCommandOutput

  /**
   * Teleports entities to random surface locations within an area with height limit.
   *
   * @param center Center coordinates of the spread area (x, z coordinates only).
   * @param spreadDistance Minimum distance between spread entities.
   * @param maxRange Maximum distance from center to spread entities.
   * @param under Literal string 'under' to enable height limiting.
   * @param height Maximum Y coordinate for spread locations.
   * @param respectTeams Whether to keep teams together when spreading.
   * @param targets Entity selector for targets to spread.
   *
   * @example
   * ```ts
   * // Underground spreading
   * spreadplayers([0, 0], 5, 100, 'under', 60, false, '@a')  // Spread below Y=60
   * spreadplayers([25, 25], 8, 75, 'under', 40, true, '@a[team=miners]')
   * ```
   */
  spreadplayers(
    center: Macroable<ColumnCoordinates<MACRO>, MACRO>,
    spreadDistance: Macroable<number, MACRO>,
    maxRange: Macroable<number, MACRO>,
    under: 'under',
    height: Macroable<number, MACRO>,
    respectTeams: Macroable<boolean, MACRO>,
    targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
  ): FinalCommandOutput

  spreadplayers(...args: unknown[]) {
    return this.finalCommand([coordinatesParser(args[0]), ...args.slice(1, -1), targetParser(args.at(-1))])
  }
}
