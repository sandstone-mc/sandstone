import type { LiteralUnion } from '@/generalTypes'
import type {
  CONTAINER_SLOTS, Coordinates, ENTITY_SLOTS, ITEMS, MultipleEntitiesArgument,
} from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { coordinatesParser } from '@variables'

export class ReplaceItem extends Command {
    @command(['replaceitem', 'block'], { isRoot: true, parsers: { '0': coordinatesParser } })
    block = (pos: Coordinates, slot: CONTAINER_SLOTS, item: LiteralUnion<ITEMS>, count?: number) => { }

    @command(['replaceitem', 'entity'], { isRoot: true })
    entity = (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS, item: LiteralUnion<ITEMS>, count?: number) => { }
}
