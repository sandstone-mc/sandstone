import { LiteralUnion } from '@/generalTypes'
import {
  CONTAINER_SLOTS, Coordinates, coordinatesParser, ENTITY_SLOTS, ITEMS, MultipleEntitiesArgument,
} from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class ReplaceItem extends Command {
    @command(['replaceitem', 'block'], { isRoot: true, parsers: { '0': coordinatesParser } })
    block = (pos: Coordinates, slot: CONTAINER_SLOTS, item: LiteralUnion<ITEMS>, count?: number) => { }

    @command(['replaceitem', 'entity'], { isRoot: true })
    entity = (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS, item: LiteralUnion<ITEMS>, count?: number) => { }
}
