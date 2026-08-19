import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonMobEffectInstance } from 'sandstone/arguments/generated/_json/util/effect.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTInt } from 'sandstone'

export type JsonEffectItem = (JsonItemBase & {
  /**
   * List of the effects that will be applied with this item.
   */
  custom_potion_effects?: Array<JsonMobEffectInstance>,
  /**
   * Default potion effect
   */
  Potion?: JsonRegistry['minecraft:potion'],
  /**
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  CustomPotionColor?: (NBTInt | number),
})
