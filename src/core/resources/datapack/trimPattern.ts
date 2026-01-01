import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.trimPatternJSON)
}

// TODO: Investigate potential abstractions
export type TrimPatternClassArguments = {
  /**
   * The trim pattern's JSON.
   */
  trimPattern: NonNullable<SymbolResource['trim_pattern']>
} & ResourceClassArguments<'default'>

export class TrimPatternClass extends ResourceClass<TrimPatternNode> {
  public trimPatternJSON: NonNullable<TrimPatternClassArguments['trimPattern']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimPatternClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrimPatternNode,
      sandstoneCore.pack.resourceToPath(name, ['trim_pattern']),
      args,
    )

    this.trimPatternJSON = args.trimPattern

    this.handleConflicts()
  }
}
