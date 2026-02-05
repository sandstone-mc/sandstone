import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import { toMinecraftResourceName } from 'sandstone/utils'

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
  timeline: SymbolResource['timeline']
} & ResourceClassArguments<'default'>

export class TimelineClass extends ResourceClass<TimelineNode> {
  public timelineJSON: NonNullable<TimelineClassArguments['timeline']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TimelineClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TimelineNode,
      sandstoneCore.pack.resourceToPath(name, ['timeline']),
      args,
    )

    this.timelineJSON = args.timeline

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
  worldClock: SymbolResource['world_clock']
} & ResourceClassArguments<'default'>

export class WorldClockClass extends ResourceClass<WorldClockNode> {
  public worldClockJSON: NonNullable<WorldClockClassArguments['worldClock']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: WorldClockClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      WorldClockNode,
      sandstoneCore.pack.resourceToPath(name, ['world_clock']),
      args,
    )

    this.worldClockJSON = args.worldClock

    this.handleConflicts()
  }

  get name(): `${string}:${string}` {
    return toMinecraftResourceName(this.path)
  }

  toString() {
    return this.name
  }
}
