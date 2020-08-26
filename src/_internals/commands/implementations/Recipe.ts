import { LiteralUnion } from '@/generalTypes'
import { ITEMS, MultipleEntitiesArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Recipe extends Command {
    @command(['recipe', 'give'], { isRoot: true })
    give = (targets: MultipleEntitiesArgument, recipe: LiteralUnion<'*' | ITEMS>) => { }

    @command(['recipe', 'take'], { isRoot: true })
    take = (targets: MultipleEntitiesArgument, recipe: LiteralUnion<'*' | ITEMS>) => { }
}
