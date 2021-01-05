import { coordinatesParser } from '@variables'

import { Command } from '../Command'
import { command } from '../decorators'

import type { Coordinates, MultipleEntitiesArgument } from '@arguments'

export class SpreadPlayers extends Command {
  @command('spreadplayers', {
    isRoot: true,
    parsers: {
      '0': coordinatesParser,
      '3': (maxHeight, args) => {
        if (args.length === 6) {
          return `under ${maxHeight}`
        }
        return maxHeight
      },
    },
  })
  spreadplayers: (
    (
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
     * @param respectTeams Specifies whether to keep teams together.
     * If `true`, targets on the same team will be teleported to the same location.
     *
     * @param targets Specifies the targets to spread.
     */
    (center: Coordinates, spreadDistance: number, maxRange: number, respectTeams: boolean, targets:MultipleEntitiesArgument) => void) & (
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
     * @param underHeight Specifies the maximum height for resulting positions.
     *
     * @param respectTeams Specifies whether to keep teams together.
     * If `true`, targets on the same team will be teleported to the same location.
     *
     * @param targets Specifies the targets to spread.
     */
    (center: Coordinates, spreadDistance: number, maxRange: number, underHeight: number, respectTeams: boolean, targets: MultipleEntitiesArgument) => void)
  ) = (...args: unknown[]) => {}
}
