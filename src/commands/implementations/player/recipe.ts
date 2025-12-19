import type { MultiplePlayersArgument } from 'sandstone/arguments'
import type { Macroable, RecipeClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class RecipeCommandNode extends CommandNode {
  command = 'recipe' as const
}

export class RecipeCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = RecipeCommandNode

  /**
   * Unlock recipes for players.
   *
   * @param targets Player selector to give recipes to.
   *               Examples: '@p', '@a', 'PlayerName', '@a[team=builders]'
   *
   * @param recipe Recipe to unlock. Use '*' for all recipes.
   *              Examples: 'minecraft:iron_sword', 'minecraft:bread', '*'
   *
   * @example
   * ```ts
   * recipe.give('@p', 'minecraft:iron_sword')       // Unlock iron sword recipe
   * recipe.give('@a', '*')                         // Unlock all recipes
   * recipe.give('@a[team=builders]', 'minecraft:stone_bricks')
   * ```
   */
  give = (
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    recipe: Macroable<LiteralUnion<'*' | ITEMS> | RecipeClass, MACRO>,
  ) => this.finalCommand(['give', targetParser(targets), recipe])

  /**
   * Lock recipes for players.
   *
   * @param targets Player selector to take recipes from.
   *               Examples: '@p', '@a', 'PlayerName', '@a[team=novices]'
   *
   * @param recipe Recipe to lock. Use '*' for all recipes.
   *              Examples: 'minecraft:diamond_sword', 'minecraft:cake', '*'
   *
   * @example
   * ```ts
   * recipe.take('@p', 'minecraft:diamond_sword')    // Lock diamond sword recipe
   * recipe.take('@a', '*')                         // Lock all recipes
   * recipe.take('@a[team=beginners]', 'minecraft:enchanting_table')
   * ```
   */
  take = (
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    recipe: Macroable<LiteralUnion<'*' | ITEMS> | RecipeClass, MACRO>,
  ) => this.finalCommand(['take', targetParser(targets), recipe])
}
