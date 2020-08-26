import { LiteralUnion } from '@/generalTypes'
import {
  Coordinates, coordinatesParser, MultipleEntitiesArgument, MultiplePlayersArgument, SingleEntityArgument,
} from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

class LootSource extends Command {
  @command('fish', { parsers: { '0': coordinatesParser } })
  fish = (lootTable: string, pos: Coordinates, tool: LiteralUnion<'mainhand' | 'offhand'>) => { }

  @command('loot')
  loot = (lootTable: string) => { }

  @command('kill')
  kill = (target: SingleEntityArgument) => { }

  @command('mine', { parsers: { '0': coordinatesParser } })
  mine = (pos: Coordinates, tool: LiteralUnion<'mainhand' | 'offhand'>) => { }
}

export class Loot extends Command {
  @command(['loot', 'spawn'], {
    isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': coordinatesParser },
  })
  spawn = (targetPos: Coordinates) => new LootSource(this.commandsRoot)

  @command(['loot', 'replace', 'entity'], { isRoot: true, hasSubcommands: true, executable: false })
  replaceEntity = (entities: MultipleEntitiesArgument, slot: string, count?: number) => new LootSource(this.commandsRoot)

  @command(['loot', 'replace', 'block'], {
    isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': coordinatesParser },
  })
  replaceBlock = (targetPos: Coordinates, slot: string, count?: number) => new LootSource(this.commandsRoot)

  @command(['loot', 'give'], { isRoot: true, hasSubcommands: true, executable: false })
  give = (players: MultiplePlayersArgument) => new LootSource(this.commandsRoot)

  @command(['loot', 'insert'], {
    isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': coordinatesParser },
  })
  insert = (targetPos: Coordinates) => new LootSource(this.commandsRoot)
}
