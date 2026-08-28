import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

// ============================================================================
// Timeline
// ============================================================================

/**
 * A node representing a Minecraft timeline.
 */
export class TimelineNode extends ContainerNode implements ResourceNode<TimelineClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TimelineClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type TimelineClassArguments = {
  /**
   * The timeline's JSON.
   */
  json: JsonSymbolResource[(typeof TimelineClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TimelineClass extends ResourceClass<TimelineNode> implements JsonResource {
  static readonly resourceType = 'timeline' as const

  public json: NonNullable<TimelineClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TimelineClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TimelineNode,
      TimelineClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TimelineClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}

// ============================================================================
// World Clock
// ============================================================================

/**
 * A node representing a Minecraft world clock.
 */
export class WorldClockNode extends ContainerNode implements ResourceNode<WorldClockClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: WorldClockClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type WorldClockClassArguments = {
  /**
   * The world clock's JSON.
   */
  json: JsonSymbolResource[(typeof WorldClockClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class WorldClockClass extends ResourceClass<WorldClockNode> implements JsonResource {
  static readonly resourceType = 'world_clock' as const

  public json: NonNullable<WorldClockClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: WorldClockClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      WorldClockNode,
      WorldClockClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[WorldClockClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }

  toString() {
    return this.name
  }
}
