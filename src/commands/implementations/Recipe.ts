import { MultipleEntitiesArgument } from 'src/arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { ITEMS, MultiplePlayersArgument } from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'

/** Gives or takes (unlocks or locks) recipes for players. */
export class RecipeCommand extends Command {
    /**
     * Gives recipes to the player.
     *
     * @param targets Specifies the player(s) to give the recipe to.
     * @param recipe Specifies a recipe to give. If `*` is specified, then all recipes will be given.
     */
    @command(['recipe', 'give'], { isRoot: true })
    give = (targets: MultiplePlayersArgument, recipe: LiteralUnion<'*' | ITEMS>) => { }

    /**
     * Takes recipes to the player.
     *
     * @param targets Specifies the player(s) to take the recipe from.
     * @param recipe Specifies a recipe to take. If `*` is specified, then all recipes will be taken.
     */
   @command(['recipe', 'take'], { isRoot: true })
    take = (targets: MultiplePlayersArgument, recipe: LiteralUnion<'*' | ITEMS>) => { }
}
