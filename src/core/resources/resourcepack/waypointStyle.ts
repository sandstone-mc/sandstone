import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type WaypointStyleClassArguments = {
  /**
   * The waypoint style's JSON.
   */
  json: JsonSymbolResource[(typeof WaypointStyleClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class WaypointStyleClass extends ResourceClass<WaypointStyleNode> implements JsonResource {
  static readonly resourceType = 'waypoint_style'

  public json: NonNullable<WaypointStyleClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: WaypointStyleClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      WaypointStyleNode,
      WaypointStyleClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[WaypointStyleClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
