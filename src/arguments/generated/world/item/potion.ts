import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { MobEffectInstance } from 'sandstone/arguments/generated/util/effect.js'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'
import type { NBTInt } from 'sandstone'

export type EffectItem = (ItemBase & {
    /**
     * List of the effects that will be applied with this item.
     */
    custom_potion_effects?: Array<MobEffectInstance>
    /**
     * Default potion effect
     */
    Potion?: Registry['minecraft:potion']
    /**
     * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
     */
    CustomPotionColor?: NBTInt
})
