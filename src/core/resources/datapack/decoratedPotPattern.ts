import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft decorated pot pattern.
 */
export class DecoratedPotPatternNode extends ContainerNode implements ResourceNode<DecoratedPotPatternClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: DecoratedPotPatternClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.decoratedPotPatternJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type DecoratedPotPatternClassArguments = {
  /**
   * The decorated pot pattern's JSON.
   */
  json: SymbolResource[(typeof DecoratedPotPatternClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class DecoratedPotPatternClass extends ResourceClass<DecoratedPotPatternNode> {
  static readonly resourceType = 'decorated_pot_pattern' as const

  public decoratedPotPatternJSON: NonNullable<DecoratedPotPatternClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: DecoratedPotPatternClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      DecoratedPotPatternNode,
      DecoratedPotPatternClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[DecoratedPotPatternClass.resourceType].path),
      args,
    )

    this.decoratedPotPatternJSON = args.json

    this.handleConflicts()
  }
}