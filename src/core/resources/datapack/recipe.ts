import type { Dispatcher, MultiplePlayersArgument } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.recipeJSON)
}

export type RecipeClassArguments = {
  /**
   * The recipe's JSON.
   */
  recipe: NonNullable<Dispatcher<'minecraft:resource'>['recipe']>
} & ResourceClassArguments<'default'>

export class RecipeClass extends ResourceClass<RecipeNode> {
  public recipeJSON: NonNullable<RecipeClassArguments['recipe']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: RecipeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      RecipeNode,
      sandstoneCore.pack.resourceToPath(name, ['recipe']),
      args,
    )

    this.recipeJSON = args.recipe

    this.handleConflicts()
  }

  /**
   * Give this recipe.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  give = (players: MultiplePlayersArgument<false> = '@s') => {
    this.pack.commands.recipe.give(players, this)
  }

  /**
   * Take this recipe.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  take = (players: MultiplePlayersArgument<false> = '@s') => {
    this.pack.commands.recipe.take(players, this)
  }
}
