import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { ColumnCoordinates, MultipleEntitiesArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import type { FinalCommandOutput } from '../../helpers.js'

export class SpreadPlayersNode extends CommandNode {
  command = 'spreadplayers' as const
}

export class SpreadPlayersCommand<MACRO extends boolean> extends CommandArguments<typeof SpreadPlayersNode> {
  protected NodeType = SpreadPlayersNode

  spreadplayers: (
    (
    /**
     * Teleports entities to random surface locations within an area.
     *
     * @param center Specifies the center of the region to spread targets to. You must only specify the `x` and the `z` coordinates.
     *
     * @param spreadDistance Specifies the minimum distance between targets.
     *
     * @param maxRange Specifies the maximum distance on each horizontal axis from the center of the area to spread targets
     * (thus, the area is square, not circular).
     *
     * @param respectTeams Specifies whether to keep teams together.
     * If `true`, targets on the same team will be teleported to the same location.
     *
     * @param targets Specifies the targets to spread.
     */
    (
      center: Macroable<ColumnCoordinates<MACRO>, MACRO>,
      spreadDistance: Macroable<number, MACRO>,
      maxRange: Macroable<number, MACRO>,
      respectTeams: Macroable<boolean, MACRO>,
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
    ) => FinalCommandOutput) & (
    /**
     * Teleports entities to random surface locations within an area.
     *
     * @param center Specifies the center of the region to spread targets to.
     *
     * @param spreadDistance Specifies the minimum distance between targets.
     *
     * @param maxRange Specifies the maximum distance on each horizontal axis from the center of the area to spread targets
     * (thus, the area is square, not circular).
     *
     * @param height Specifies the maximum height for resulting positions.
     *
     * @param respectTeams Specifies whether to keep teams together.
     * If `true`, targets on the same team will be teleported to the same location.
     *
     * @param targets Specifies the targets to spread.
     */
    (center: Macroable<ColumnCoordinates<MACRO>, MACRO>,
      spreadDistance: Macroable<number, MACRO>,
      maxRange: Macroable<number, MACRO>,
      under: 'under',
      height: Macroable<number, MACRO>,
      respectTeams: Macroable<boolean, MACRO>,
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>
    ) => FinalCommandOutput)
  ) = (...args: unknown[]) => this.finalCommand(
      [coordinatesParser(args[0]), ...args.slice(1, -1), targetParser(args.slice(-1))],
    )
}
