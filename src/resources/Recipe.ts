import { ResourceInstance } from './Resource'

import type { MultiplePlayersArgument, RecipeJSON } from 'src/arguments'
import type { Datapack } from '@datapack'

export type RecipeOptions = {
  /**
   * What to do if another Recipe has the same name.
   *
   * - `throw`: Throw an error.
   * - `replace`: Replace silently the old Recipe with the new one.
   * - `ignore`: Keep silently the old Recipe, discarding the new one.
   */
  onConflict?: 'throw' | 'replace' | 'ignore'
}

export class RecipeInstance<P1 extends string = string, P2 extends string = string, P3 extends string = string> extends ResourceInstance {
  recipeJson

  constructor(datapack: Datapack, name: string, recipe: RecipeJSON<P1, P2, P3>, options?: RecipeOptions) {
    super(datapack, name)

    this.recipeJson = recipe

    this.datapack.addResource(name, 'recipes', { recipe }, options?.onConflict ?? 'warn')
  }

  /** Give this recipe to the given players. */
  give = (targets: MultiplePlayersArgument) => {
    this.datapack.commandsRoot.recipe.give(targets, this.name)
  }

  /** Take this recipe from the given players. */
  take = (targets: MultiplePlayersArgument) => {
    this.datapack.commandsRoot.recipe.take(targets, this.name)
  }
}
