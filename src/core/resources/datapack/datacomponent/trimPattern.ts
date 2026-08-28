import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft trim pattern.
 */
export class TrimPatternNode extends ContainerNode implements ResourceNode<TrimPatternClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TrimPatternClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

// TODO: Investigate potential abstractions
export type TrimPatternClassArguments = {
  /**
   * The trim pattern's JSON.
   */
  json: JsonSymbolResource[(typeof TrimPatternClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TrimPatternClass extends ResourceClass<TrimPatternNode> implements JsonResource {
  static readonly resourceType = 'trim_pattern' as const

  public json: NonNullable<TrimPatternClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimPatternClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrimPatternNode,
      TrimPatternClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TrimPatternClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
