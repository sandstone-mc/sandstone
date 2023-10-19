import { CommandNode } from 'sandstone/core'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { ITEMS, MultiplePlayersArgument } from 'sandstone/arguments'
import type { RecipeClass } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { Macroable } from 'sandstone/variables'

export class RecipeCommandNode extends CommandNode {
  command = 'recipe' as const
}

/** Gives or takes (unlocks or locks) recipes for players. */
export class RecipeCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = RecipeCommandNode

  /**
   * Gives recipes to the player.
   *
   * @param targets Specifies the player(s) to give the recipe to.
   * @param recipe Specifies a recipe to give. If `*` is specified, then all recipes will be given.
   */
  give = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>, recipe: Macroable<LiteralUnion<'*' | ITEMS> | RecipeClass, MACRO>) => this.finalCommand(['give', targetParser(targets), recipe])

  /**
   * Takes recipes to the player.
   *
   * @param targets Specifies the player(s) to take the recipe from.
   * @param recipe Specifies a recipe to take. If `*` is specified, then all recipes will be taken.
   */
  take = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>, recipe: Macroable<LiteralUnion<'*' | ITEMS> | RecipeClass, MACRO>) => this.finalCommand(['take', targetParser(targets), recipe])
}
