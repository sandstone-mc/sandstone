import { CommandNode } from '#core'
import { coordinatesParser } from '#variables'

import { CommandArguments } from '../helpers'

import type { FinalCommandOutput } from '../helpers'
import type { ColumnCoordinates, MultipleEntitiesArgument } from '#arguments'

export class SpreadPlayersNode extends CommandNode {
  command = 'spreadplayers' as const
}

export class SpreadPlayersCommand extends CommandArguments<typeof SpreadPlayersNode> {
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
    (center: ColumnCoordinates, spreadDistance: number, maxRange: number, respectTeams: boolean, targets:MultipleEntitiesArgument) => FinalCommandOutput) & (
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
    (center: ColumnCoordinates, spreadDistance: number, maxRange: number, under: 'under', height: number, respectTeams: boolean, targets: MultipleEntitiesArgument) => FinalCommandOutput)
  ) = (...args: unknown[]) => this.finalCommand(
      [coordinatesParser(args[0]), ...args.slice(1)],
    )
}
