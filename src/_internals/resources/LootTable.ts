import type { LiteralUnion } from '@/generalTypes'
import type {
  Coordinates, ENTITY_SLOTS, LootTableType, MultipleEntitiesArgument, MultiplePlayersArgument,
} from '@arguments'
import type { Datapack } from '@datapack'
import { toMcFunctionName } from '@datapack/minecraft'

export class LootTable {
  lootTable

  private path

  private datapack

  constructor(datapack: Datapack, name: string, lootTable: LootTableType) {
    this.lootTable = lootTable

    this.path = datapack.getResourcePath(name)

    this.datapack = datapack

    datapack.addResource(name, 'loot_tables', { lootTable })
  }

  get name() {
    return toMcFunctionName(this.path.fullPathWithNamespace)
  }

  give = (players: MultiplePlayersArgument) => this.datapack.commandsRoot.loot.give(players).loot(this.name)

  insert = (targetPos: Coordinates) => this.datapack.commandsRoot.loot.insert(targetPos).loot(this.name)

  replaceBlock = (targetPos: Coordinates, slot: string, count?: number) => this.datapack.commandsRoot.loot.replaceBlock(targetPos, slot, count).loot(this.name)

  replaceEntity = (entities: MultipleEntitiesArgument, slot: LiteralUnion<ENTITY_SLOTS>, count?: number) => this.datapack.commandsRoot.loot.replaceEntity(entities, slot, count).loot(this.name)
}
