import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import type { ConditionClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft slot source.
 */
export class SlotSourceNode extends ContainerNode implements ResourceNode<SlotSourceClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: SlotSourceClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.slotSourceJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type SlotSourceClassArguments = {
  /**
   * The slot source's JSON.
   */
  json: /*Json*/SymbolResource[(typeof SlotSourceClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class SlotSourceClass extends ResourceClass<SlotSourceNode> implements ConditionClass {
  declare readonly __conditionClassBrand: true

  static readonly resourceType = 'slot_source' as const

  public slotSourceJSON: SlotSourceClassArguments['json']

  constructor(sandstoneCore: SandstoneCore, name: string, args: SlotSourceClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      SlotSourceNode,
      SlotSourceClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[SlotSourceClass.resourceType].path),
      args,
    )

    this.slotSourceJSON = args.json

    this.handleConflicts()
  }

  /** @internal */
  _toMinecraftCondition = () => new this.pack.conditions.SlotSource(this.core, this.name)

  /** @internal */
  toJSON() {
    return this.slotSourceJSON
  }
}