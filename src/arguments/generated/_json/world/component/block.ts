import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonDyeColor } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonAnyEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonItemStackTemplate } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonNBTList, LootTableClass, NBTInt, NBTLong } from 'sandstone'

export type JsonContainerLoot = {
  loot_table: (JsonRegistry['minecraft:loot_table'] | LootTableClass),
  seed?: (NBTLong | number),
}

export type JsonContainerSlot = {
  /**
   * The slot ID of the container.
   *
   * Value:
   * Range: 0..255
   */
  slot: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * The item stack in this container slot.
   */
  item: JsonItemStackTemplate,
}

export type JsonOccupant = {
  entity_data: JsonAnyEntity,
  min_ticks_in_hive: (NBTInt | number),
  ticks_in_hive: (NBTInt | number),
}

export type JsonPotDecorations = {
  back?: JsonItemStackTemplate,
  left?: JsonItemStackTemplate,
  right?: JsonItemStackTemplate,
  front?: JsonItemStackTemplate,
}

/**
 * List length range: 4
 */
export type JsonSignLines = JsonNBTList<JsonText, {
  leftExclusive: false,
  rightExclusive: false,
  min: 4,
  max: 4,
}>

export type JsonSignText = {
  messages: JsonSignLines,
  /**
   * Shown to players with the profanity filter enabled on Realms.
   */
  filtered_messages?: JsonSignLines,
  /**
   * Value:
   *
   *  - White(`white`)
   *  - Orange(`orange`)
   *  - Magenta(`magenta`)
   *  - LightBlue(`light_blue`)
   *  - Yellow(`yellow`)
   *  - Lime(`lime`)
   *  - Pink(`pink`)
   *  - Gray(`gray`)
   *  - LightGray(`light_gray`)
   *  - Cyan(`cyan`)
   *  - Purple(`purple`)
   *  - Blue(`blue`)
   *  - Brown(`brown`)
   *  - Green(`green`)
   *  - Red(`red`)
   *  - Black(`black`)
   */
  color?: JsonDyeColor,
  has_glowing_text?: boolean,
}
