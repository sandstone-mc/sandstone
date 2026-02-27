import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
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

  getValue = () => jsonStringify(this.resource.waypointStyleJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type WaypointStyleClassArguments = {
  /**
   * The waypoint style's JSON.
   */
  json: SymbolResource[(typeof WaypointStyleClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class WaypointStyleClass extends ResourceClass<WaypointStyleNode> {
  static readonly resourceType = 'waypoint_style'

  public waypointStyleJSON: NonNullable<WaypointStyleClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: WaypointStyleClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      WaypointStyleNode,
      WaypointStyleClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[WaypointStyleClass.resourceType].path),
      args,
    )

    this.waypointStyleJSON = args.json

    this.handleConflicts()
  }
}
