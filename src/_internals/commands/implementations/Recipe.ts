import { LiteralUnion } from '@/generalTypes'
import { ITEMS, MultipleEntitiesArgument, MultiplePlayersArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Recipe extends Command {
    @command(['recipe', 'give'], { isRoot: true })
    give = (targets: MultiplePlayersArgument, recipe: LiteralUnion<'*' | ITEMS>) => { }

    @command(['recipe', 'take'], { isRoot: true })
    take = (targets: MultiplePlayersArgument, recipe: LiteralUnion<'*' | ITEMS>) => { }
}
