import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { DyeColor } from 'sandstone/arguments/generated/util/color.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { AnyEntity } from 'sandstone/arguments/generated/world/entity.ts'
import type { ItemStackTemplate } from 'sandstone/arguments/generated/world/item.ts'
import type { LootTableClass, NBTInt, NBTList, NBTLong } from 'sandstone'

export type ContainerLoot = {
  loot_table: (Registry['minecraft:loot_table'] | LootTableClass),
  seed?: NBTLong,
}

export type ContainerSlot = {
  /**
   * The slot ID of the container.
   *
   * Value:
   * Range: 0..255
   */
  slot: NBTInt<{
    min: 0,
  }>,
  /**
   * The item stack in this container slot.
   */
  item: ItemStackTemplate,
}

export type Occupant = {
  entity_data: AnyEntity,
  min_ticks_in_hive: NBTInt,
  ticks_in_hive: NBTInt,
}

export type PotDecorations = {
  back?: ItemStackTemplate,
  left?: ItemStackTemplate,
  right?: ItemStackTemplate,
  front?: ItemStackTemplate,
}

/**
 * List length range: 4
 */
export type SignLines = NBTList<Text, {
  leftExclusive: false,
  rightExclusive: false,
  min: 4,
  max: 4,
}>

export type SignText = {
  messages: SignLines,
  /**
   * Shown to players with the profanity filter enabled on Realms.
   */
  filtered_messages?: SignLines,
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
  color?: DyeColor,
  has_glowing_text?: boolean,
}
