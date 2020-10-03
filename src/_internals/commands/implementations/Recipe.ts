import type { LiteralUnion } from '@/generalTypes'
import type { ITEMS, MultiplePlayersArgument } from '@arguments'
import { MultipleEntitiesArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class RecipeCommand extends Command {
    @command(['recipe', 'give'], { isRoot: true })
    give = (targets: MultiplePlayersArgument, recipe: LiteralUnion<'*' | ITEMS>) => { }

    @command(['recipe', 'take'], { isRoot: true })
    take = (targets: MultiplePlayersArgument, recipe: LiteralUnion<'*' | ITEMS>) => { }
}
