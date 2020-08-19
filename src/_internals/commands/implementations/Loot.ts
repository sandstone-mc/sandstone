import { LiteralUnion } from '@/generalTypes'
import { Coordinates, SelectorArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

class LootSource extends Command {
  @command('fish')
  fish = (lootTable: string, pos: Coordinates, tool: LiteralUnion<'mainhand' | 'offhand'>) => {}

  @command('loot')
  loot = (lootTable: string) => {}

  @command('kill')
  kill = (target: SelectorArgument<true>) => {}

  @command('mine')
  mine = (pos: Coordinates, tool: LiteralUnion<'mainhand' | 'offhand'>) => {}
}

export class Loot extends Command {
  @command(['loot', 'spawn'], { isRoot: true, hasSubcommands: true, executable: false })
  spawn = (targetPos: Coordinates) => new LootSource(this.commandsRoot)

  @command(['loot', 'replace', 'entity'], { isRoot: true, hasSubcommands: true, executable: false })
  replaceEntity = (entities: SelectorArgument<false>, slot: string, count?: number) => new LootSource(this.commandsRoot)

  @command(['loot', 'replace', 'block'], { isRoot: true, hasSubcommands: true, executable: false })
  replaceBlock = (targetPos: Coordinates, slot: string, count?: number) => new LootSource(this.commandsRoot)

  @command(['loot', 'give'], { isRoot: true, hasSubcommands: true, executable: false })
  give = (players: SelectorArgument<false>) => new LootSource(this.commandsRoot)

  @command(['loot', 'insert'], { isRoot: true, hasSubcommands: true, executable: false })
  insert = (targetPos: Coordinates) => new LootSource(this.commandsRoot)
}
