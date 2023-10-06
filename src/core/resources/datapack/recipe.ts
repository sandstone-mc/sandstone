import { ContainerNode } from '../../nodes.js'
import { ResourceClass } from '../resource.js'

import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ResourceClassArguments, ResourceNode } from '../resource.js'
import type { MultiplePlayersArgument, RecipeJSON } from 'sandstone/arguments/index.js'

/**
 * A node representing a Minecraft recipe.
 */
export class RecipeNode extends ContainerNode implements ResourceNode<RecipeClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: RecipeClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.recipeJSON)
}

export type RecipeClassArguments = {
  /**
   * The recipe's JSON.
   */
  recipe: RecipeJSON
} & ResourceClassArguments<'default'>

export class RecipeClass extends ResourceClass<RecipeNode> {
  public recipeJSON: NonNullable<RecipeClassArguments['recipe']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: RecipeClassArguments) {
    super(sandstoneCore, { packType: sandstoneCore.pack.dataPack(), extension: 'json' }, RecipeNode, sandstoneCore.pack.resourceToPath(name, ['recipes']), args)

    this.recipeJSON = args.recipe

    this.handleConflicts()
  }

  /**
   * Give this recipe.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  give = (players: MultiplePlayersArgument = '@s') => {
    this.pack.commands.recipe.give(players, this.name)
  }

  /**
   * Take this recipe.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  take = (players: MultiplePlayersArgument = '@s') => {
    this.pack.commands.recipe.take(players, this.name)
  }
}
