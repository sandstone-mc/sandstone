import type { EnchantmentEffectComponentMap } from 'sandstone/generated/data/enchantment/effect_component'
import type { Registry } from 'sandstone/generated/registry'
import type { EquipmentSlotGroup } from 'sandstone/generated/util/slot'
import type { Text } from 'sandstone/generated/util/text'
import type { NBTInt, TagClass } from 'sandstone'

export type Enchantment = {
    description: Text
    exclusive_set?: ((
        | Registry['minecraft:enchantment'] | `#${Registry['minecraft:tag/enchantment']}` | TagClass<'enchantment'>)
        | Array<Registry['minecraft:enchantment']>)
    supported_items: ((
        | Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>)
        | Array<Registry['minecraft:item']>)
    /**
     * Item types for which this Enchantment shows up in Enchanting Tables and on traded equipment.
     *
     * Must be a subset of `supported_items`.
     */
    primary_items?: ((
        | Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>)
        | Array<Registry['minecraft:item']>)
    /**
     * How commonly the Enchantment appears, compared to the total combined `weight` of all available Enchantments.
     *
     * Value:
     * Range: 1..1024
     */
    weight: NBTInt<{
        min: 1
    }>
    /**
     * Maximum level of the enchantment.
     *
     * Value:
     * Range: 1..255
     */
    max_level: NBTInt<{
        min: 1
    }>
    /**
     * Minimum experience cost.
     */
    min_cost: EnchantmentCost
    /**
     * Maximum experience cost.
     */
    max_cost: EnchantmentCost
    /**
     * Halved when an Enchantment is added to a book.
     * The effective fee is multiplied by the level of the Enchantment.
     *
     * Value:
     * Range: 0..
     */
    anvil_cost: NBTInt<{
        min: 0
    }>
    slots: Array<EquipmentSlotGroup>
    effects?: EnchantmentEffectComponentMap
}

export type EnchantmentCost = {
    /**
     * Base cost at level 1.
     */
    base: NBTInt
    /**
     * Cost increase per level above 1.
     */
    per_level_above_first: NBTInt
}
