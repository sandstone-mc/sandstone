import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.trimPatternJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

// TODO: Investigate potential abstractions
export type TrimPatternClassArguments = {
  /**
   * The trim pattern's JSON.
   */
  json: SymbolResource[(typeof TrimPatternClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TrimPatternClass extends ResourceClass<TrimPatternNode> {
  static readonly resourceType = 'trim_pattern' as const

  public trimPatternJSON: NonNullable<TrimPatternClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimPatternClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrimPatternNode,
      TrimPatternClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TrimPatternClass.resourceType].path),
      args,
    )

    this.trimPatternJSON = args.json

    this.handleConflicts()
  }
}
