import type {
  JsonEnchantmentEffectComponentMap,
} from 'sandstone/arguments/generated/_json/data/enchantment/effect_component.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonEquipmentSlotGroup } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { EnchantmentClass, NBTInt, TagClass } from 'sandstone'

export type JsonEnchantment = {
  description: JsonText,
  exclusive_set?: ((
        | JsonRegistry['minecraft:enchantment']
        | `#${JsonRegistry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(JsonRegistry['minecraft:enchantment'] | EnchantmentClass)>),
  supported_items: ((
      | JsonRegistry['minecraft:item'] | `#${JsonRegistry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<JsonRegistry['minecraft:item']>),
  /**
   * Item types for which this Enchantment shows up in Enchanting Tables and on traded equipment.
   *
   * Must be a subset of `supported_items`.
   */
  primary_items?: ((
      | JsonRegistry['minecraft:item'] | `#${JsonRegistry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<JsonRegistry['minecraft:item']>),
  /**
   * How commonly the Enchantment appears, compared to the total combined `weight` of all available Enchantments.
   *
   * Value:
   * Range: 1..1024
   */
  weight: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Maximum level of the enchantment.
   *
   * Value:
   * Range: 1..255
   */
  max_level: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Minimum experience cost.
   */
  min_cost: JsonEnchantmentCost,
  /**
   * Maximum experience cost.
   */
  max_cost: JsonEnchantmentCost,
  /**
   * Halved when an Enchantment is added to a book.
   * The effective fee is multiplied by the level of the Enchantment.
   *
   * Value:
   * Range: 0..
   */
  anvil_cost: (NBTInt<{
    min: 0,
  }> | number),
  slots: Array<JsonEquipmentSlotGroup>,
  effects?: JsonEnchantmentEffectComponentMap,
}

export type JsonEnchantmentCost = {
  /**
   * Base cost at level 1.
   */
  base: (NBTInt | number),
  /**
   * Cost increase per level above 1.
   */
  per_level_above_first: (NBTInt | number),
}
