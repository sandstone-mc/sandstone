import { RESOURCE_PATHS, type MultiplePlayersArgumentOf } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type RecipeClassArguments = {
  /**
   * The recipe's JSON.
   */
  json: JsonSymbolResource[(typeof RecipeClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class RecipeClass extends ResourceClass<RecipeNode> implements JsonResource {
  static readonly resourceType = 'recipe' as const

  public json: NonNullable<RecipeClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: RecipeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      RecipeNode,
      RecipeClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[RecipeClass.resourceType].path),
      args,
    )

    this.json = args.json

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
