import { RESOURCE_PATHS, type SymbolResource, type MultiplePlayersArgumentOf } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft recipe.
 */
export class RecipeNode extends ContainerNode implements ResourceNode<RecipeClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: RecipeClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.recipeJSON)
}

export type RecipeClassArguments = {
  /**
   * The recipe's JSON.
   */
  json: SymbolResource[(typeof RecipeClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class RecipeClass extends ResourceClass<RecipeNode> {
  static readonly resourceType = 'recipe' as const

  public recipeJSON: NonNullable<RecipeClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: RecipeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      RecipeNode,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[RecipeClass.resourceType].path),
      args,
    )

    this.recipeJSON = args.json

    this.handleConflicts()
  }

  /**
   * Give this recipe.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  give<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>) {
    return this.pack.commands.recipe.give(players, this)
  }

  /**
   * Take this recipe.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  take<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>) {
    return this.pack.commands.recipe.take(players, this)
  }
}
