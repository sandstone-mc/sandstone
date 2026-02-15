import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.timelineJSON)
}

export type TimelineClassArguments = {
  /**
   * The timeline's JSON.
   */
  json: SymbolResource[(typeof TimelineClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TimelineClass extends ResourceClass<TimelineNode> {
  static readonly resourceType = 'timeline' as const

  public timelineJSON: NonNullable<TimelineClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TimelineClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TimelineNode,
      TimelineClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TimelineClass.resourceType].path),
      args,
    )

    this.timelineJSON = args.json

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

  getValue = () => jsonStringify(this.resource.worldClockJSON)
}

export type WorldClockClassArguments = {
  /**
   * The world clock's JSON.
   */
  json: SymbolResource[(typeof WorldClockClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class WorldClockClass extends ResourceClass<WorldClockNode> {
  static readonly resourceType = 'world_clock' as const

  public worldClockJSON: NonNullable<WorldClockClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: WorldClockClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      WorldClockNode,
      WorldClockClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[WorldClockClass.resourceType].path),
      args,
    )

    this.worldClockJSON = args.json

    this.handleConflicts()
  }

  toString() {
    return this.name
  }
}
