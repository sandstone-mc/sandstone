import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { SelectorArgument, ITEMS } from '@arguments'
import { LiteralUnion } from '@/generalTypes'

export class Recipe extends Command {
    @command(['recipe', 'give'], { isRoot: true })
    give = (targets: SelectorArgument<false>, recipe: LiteralUnion<'*' | ITEMS>) => { }

    @command(['recipe', 'take'], { isRoot: true })
    take = (targets: SelectorArgument<false>, recipe: LiteralUnion<'*' | ITEMS>) => { }
}
