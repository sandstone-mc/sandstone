import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import {
  Coordinates, ITEMS, coordinatesParser, SelectorArgument, CONTAINER_SLOTS, ENTITY_SLOTS,
} from '@arguments'
import { LiteralUnion } from '@/generalTypes'

export class ReplaceItem extends Command {
    @command(['replaceitem', 'block'], { isRoot: true, parsers: { '0': coordinatesParser } })
    block = (pos: Coordinates, slot: CONTAINER_SLOTS, item: LiteralUnion<ITEMS>, count?: number) => { }

    @command(['replaceitem', 'entity'], { isRoot: true })
    entity = (targets: SelectorArgument<false>, slot: ENTITY_SLOTS, item: LiteralUnion<ITEMS>, count?: number) => { }
}
