import { CommandNode } from '@core'

import { CommandArguments } from '../helpers'

import type { ITEMS, MultiplePlayersArgument } from '@arguments'
import type { RecipeClass } from '@core'
import type { LiteralUnion } from '@utils'

export class RecipeCommandNode extends CommandNode {
  command = 'recipe' as const
}

/** Gives or takes (unlocks or locks) recipes for players. */
export class RecipeCommand extends CommandArguments {
  public NodeType = RecipeCommandNode

  /**
   * Gives recipes to the player.
   *
   * @param targets Specifies the player(s) to give the recipe to.
   * @param recipe Specifies a recipe to give. If `*` is specified, then all recipes will be given.
   */
  give = (targets: MultiplePlayersArgument, recipe: LiteralUnion<'*' | ITEMS> | RecipeClass) => this.finalCommand(['give', targets, recipe])

  /**
   * Takes recipes to the player.
   *
   * @param targets Specifies the player(s) to take the recipe from.
   * @param recipe Specifies a recipe to take. If `*` is specified, then all recipes will be taken.
   */
  take = (targets: MultiplePlayersArgument, recipe: LiteralUnion<'*' | ITEMS> | RecipeClass) => this.finalCommand(['take', targets, recipe])
}
