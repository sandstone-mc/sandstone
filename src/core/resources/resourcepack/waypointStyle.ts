import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft waypoint style.
 */
export class WaypointStyleNode extends ContainerNode implements ResourceNode<WaypointStyleClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: WaypointStyleClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.waypointStyleJSON)
}

export type WaypointStyleClassArguments = {
  /**
   * The waypoint style's JSON.
   */
  waypointStyle: SymbolResource['waypoint_style']
} & ResourceClassArguments<'default'>

export class WaypointStyleClass extends ResourceClass<WaypointStyleNode> {
  public waypointStyleJSON: NonNullable<WaypointStyleClassArguments['waypointStyle']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: WaypointStyleClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      WaypointStyleNode,
      sandstoneCore.pack.resourceToPath(name, ['waypoint_style']),
      args,
    )

    this.waypointStyleJSON = args.waypointStyle

    this.handleConflicts()
  }
}
