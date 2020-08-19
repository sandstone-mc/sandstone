import { Command } from "@commands/Command";
import { command } from "@commands/decorators";
import { Coordinates, ITEMS, coordinatesParser } from "@arguments";
import { LiteralUnion } from "@/generalTypes";

export class ReplaceItem extends Command {
    @command(['replaceitem', 'block'], { isRoot: true, parsers: { '0': coordinatesParser } })
    block = (pos: Coordinates, slot: string, item: LiteralUnion<ITEMS>, count?: number) => { }

    @command(['replaceitem', 'entity'], { isRoot: true })
    entity = () => { }
}