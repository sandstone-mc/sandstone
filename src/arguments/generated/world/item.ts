import type { NumberProvider } from 'sandstone/arguments/generated/data/util.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { LegacyOperation } from 'sandstone/arguments/generated/util/attribute.js'
import type { EquipmentSlotGroup } from 'sandstone/arguments/generated/util/slot.js'
import type { BlockEntityData } from 'sandstone/arguments/generated/world/block.js'
import type { DataComponentExactPredicate, DataComponentPatch } from 'sandstone/arguments/generated/world/component.js'
import type { Trim } from 'sandstone/arguments/generated/world/component/item.js'
import type { NBTDouble, NBTInt, NBTIntArray, NBTShort } from 'sandstone'

export type AttributeModifier = {
  AttributeName?: Registry['minecraft:attribute']
  /**
     * Identifying name of the modifier, has no real effect.
     */
  Name?: string
  /**
     * Slot that the modifier is active in.
     *
     * Value:
     *
     *  - Mainhand(`mainhand`)
     *  - Offhand(`offhand`)
     *  - Head(`head`)
     *  - Chest(`chest`)
     *  - Legs(`legs`)
     *  - Feet(`feet`)
     *  - Hand(`hand`)
     *  - Armor(`armor`)
     *  - Any(`any`)
     *  - Body(`body`)
     *  - Saddle(`saddle`)
     */
  Slot?: EquipmentSlotGroup
  /**
     * Value:
     *
     *  - Additive(`0`): aka. `add_value`. Adds all of the modifiers' amounts to the current value of the attribute.
     *  - Multiplicative(`1`):
     *    aka. `add_multiplied_base`. Multiplies the current value of the attribute by (1 + x),
     *    where x is the sum of the modifiers' amounts.
     *  - Percentage(`2`):
     *    aka. `add_multiplied_total`. For every modifier, multiplies the current value of the attribute by (1 + x),
     *    where x is the amount of the particular modifier.
     *    Functions the same as Operation 1 if there is only a single modifier with operation 1 or 2.
     *    However, for multiple modifiers it will multiply the modifiers rather than adding them
     */
  Operation?: LegacyOperation
  /**
     * Change in the attribute.
     */
  Amount?: (NBTDouble | number)
  /**
     * Value:
     * Array length range: 4
     */
  UUID?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
}

export type BlockItem<S = undefined> = (ItemBase & {
  BlockEntityTag?: BlockEntityData
  /**
     * Blockstate that the placed block will have.
     */
  BlockStateTag?: (S extends undefined ? Dispatcher<'mcdoc:block_item_states', [
    '%none',
  ]> : (S extends keyof Dispatcher<'mcdoc:block_item_states'>
    ? Dispatcher<'mcdoc:block_item_states'>[S]
    : Record<string, unknown>))
})

export type Display = {
  /**
     * A JSON text component.
     */
  Name?: `${any}${string}`
  /**
     * A list of JSON text components, each element being a lore line.
     */
  Lore?: Array<`${any}${string}`>
}

export type Enchantment = {
  /**
     * Which enchantment is being described.
     */
  id?: Registry['minecraft:enchantment']
  /**
     * Which level the enchantment is.
     *
     * Value:
     * Range: 0..255
     */
  lvl?: NBTShort<{
    min: 0
  }>
}

export type HideFlags = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)

export type ItemBase = (({
  [Key in `${any}${string}`]?: unknown;
}) & {
  /**
     * Damage that an item has. Only used for tools, armor, etc.
     */
  Damage?: NBTInt
  /**
     * Whether the item should be unbreakable.
     * Only used for tools, armor, etc.
     */
  Unbreakable?: boolean
  /**
     * List of the block states that can be destroyed by this item when holding it in adventure mode.
     */
  CanDestroy?: Array<`${any}${string}`>
  /**
     * List of blockstates that this block item can be placed on.
     */
  CanPlaceOn?: Array<`${any}${string}`>
  /**
     * Tag that describes the custom model an item will take.
     * Used by the `custom_model_data` model overrides predicate.
     * Has certain restrictions due to float conversion.
     */
  CustomModelData?: NBTInt
  /**
     * List of enchantments that are on the item.
     */
  Enchantments?: Array<Enchantment>
  /**
     * Number of experience levels to add to the base level cost when repairing, combining, or renaming this item with an anvil.
     */
  RepairCost?: NBTInt
  /**
     * Applied to an entity that has equipped the item.
     */
  AttributeModifiers?: Array<AttributeModifier>
  /**
     * Display settings.
     */
  display?: Display
  /**
     * Bitfield for which flags to hide on an item.
     */
  HideFlags?: NBTInt
  /**
     * Trim to apply to the item & armor when worn.
     */
  Trim?: Trim
})

export type ItemCost = ItemStackOfComponent<DataComponentExactPredicate>

export type ItemStack = ItemStackOfComponent<DataComponentPatch>

export type ItemStackOfComponent<T> = (SingleItemOfComponent<T> & {
  /**
     * Number of items in the stack
     *
     * Value:
     * Range: 1..99
     */
  count?: NBTInt<{
    min: 1
    max: 99
  }>
})

export type SingleItem = SingleItemOfComponent<DataComponentPatch>

export type SingleItemOfComponent<T> = {
  /**
     * ID of the item.
     */
  id: Registry['minecraft:item']
  components?: T
}

export type TradeCost = (SingleItemOfComponent<DataComponentExactPredicate> & {
  /**
     * Defaults to `1`.
     */
  count?: NumberProvider
})
