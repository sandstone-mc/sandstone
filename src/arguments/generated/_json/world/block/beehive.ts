import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonAnyEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type JsonBee = {
  min_ticks_in_hive: (NBTInt | number),
  ticks_in_hive: (NBTInt | number),
  entity_data: JsonAnyEntity,
}

export type JsonBeehive = (JsonBlockEntity & {
  /**
   * Value:
   * Array length range: 3
   */
  flower_pos?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  bees?: Array<JsonBee>,
})

export type JsonFlowerPos = {
  X?: (NBTInt | number),
  Y?: (NBTInt | number),
  Z?: (NBTInt | number),
}

export type JsonLegacyBee = {
  MinOccupationTicks?: (NBTInt | number),
  TicksInHive?: (NBTInt | number),
  EntityData?: JsonAnyEntity,
}
