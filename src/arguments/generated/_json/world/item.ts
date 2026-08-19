import type { JsonNumberProvider } from 'sandstone/arguments/generated/_json/data/number_provider.ts'
import type { JsonSymbolMcdocBlockItemStates } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonLegacyOperation } from 'sandstone/arguments/generated/_json/util/attribute.ts'
import type { JsonEquipmentSlotGroup } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonBlockEntityData } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonTrim } from 'sandstone/arguments/generated/_json/world/component/item.ts'
import type {
  JsonDataComponentExactPredicate,
  JsonDataComponentPatch,
} from 'sandstone/arguments/generated/_json/world/component.ts'
import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type { EnchantmentClass, NBTDouble, NBTInt, NBTIntArray, NBTShort, NonEmptyString } from 'sandstone'

export type JsonAttributeModifier = {
  AttributeName?: JsonRegistry['minecraft:attribute'],
  /**
   * Identifying name of the modifier, has no real effect.
   */
  Name?: string,
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
  Slot?: JsonEquipmentSlotGroup,
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
  Operation?: JsonLegacyOperation,
  /**
   * Change in the attribute.
   */
  Amount?: (NBTDouble | number),
  /**
   * Value:
   * Array length range: 4
   */
  UUID?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
}

export type JsonBlockItem<S = undefined> = (JsonItemBase & {
  BlockEntityTag?: JsonBlockEntityData,
  /**
   * Blockstate that the placed block will have.
   */
  BlockStateTag?: (S extends undefined
    ? JsonSymbolMcdocBlockItemStates<'%none'> :
    (S extends keyof JsonSymbolMcdocBlockItemStates
      ? JsonSymbolMcdocBlockItemStates[S]
      : JsonSymbolMcdocBlockItemStates<'%unknown'>)),
})

export type JsonDisplay = {
  /**
   * A JSON text component.
   */
  Name?: NonEmptyString,
  /**
   * A list of JSON text components, each element being a lore line.
   */
  Lore?: Array<NonEmptyString>,
}

export type JsonEnchantment = {
  /**
   * Which enchantment is being described.
   */
  id?: (JsonRegistry['minecraft:enchantment'] | EnchantmentClass),
  /**
   * Which level the enchantment is.
   *
   * Value:
   * Range: 0..255
   */
  lvl?: (NBTShort<{
    min: 0,
  }> | number),
}

export type JsonHideFlags = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)

export type JsonItemBase = (({
  [Key in NonEmptyString]?: JsonNBTObject
}) & {
  /**
   * Damage that an item has. Only used for tools, armor, etc.
   */
  Damage?: (NBTInt | number),
  /**
   * Whether the item should be unbreakable.
   * Only used for tools, armor, etc.
   */
  Unbreakable?: boolean,
  /**
   * List of the block states that can be destroyed by this item when holding it in adventure mode.
   */
  CanDestroy?: Array<NonEmptyString>,
  /**
   * List of blockstates that this block item can be placed on.
   */
  CanPlaceOn?: Array<NonEmptyString>,
  /**
   * Tag that describes the custom model an item will take.
   * Used by the `custom_model_data` model overrides predicate.
   * Has certain restrictions due to float conversion.
   */
  CustomModelData?: (NBTInt | number),
  /**
   * List of enchantments that are on the item.
   */
  Enchantments?: Array<JsonEnchantment>,
  /**
   * Number of experience levels to add to the base level cost when repairing, combining, or renaming this item with an anvil.
   */
  RepairCost?: (NBTInt | number),
  /**
   * Applied to an entity that has equipped the item.
   */
  AttributeModifiers?: Array<JsonAttributeModifier>,
  /**
   * Display settings.
   */
  display?: JsonDisplay,
  /**
   * Bitfield for which flags to hide on an item.
   */
  HideFlags?: (NBTInt | number),
  /**
   * Trim to apply to the item & armor when worn.
   */
  Trim?: JsonTrim,
})

export type JsonItemCost = JsonItemStackOfComponent<JsonDataComponentExactPredicate>

export type JsonItemStack = JsonItemStackOfComponent<JsonDataComponentPatch>

export type JsonItemStackOfComponent<T extends JsonNBTObject> = (JsonSingleItemOfComponent<T> & {
  /**
   * Number of items in the stack.
   * Defaults to `1`.
   *
   * Value:
   * Range: 1..99
   */
  count?: (NBTInt<{
    min: 1,
    max: 99,
  }> | number),
})

export type JsonItemStackTemplate = (JsonItemStack | JsonRegistry['minecraft:item'])

export type JsonSingleItem = JsonSingleItemOfComponent<JsonDataComponentPatch>

export type JsonSingleItemOfComponent<T extends JsonNBTObject> = {
  /**
   * ID of the item.
   */
  id: JsonRegistry['minecraft:item'],
  components?: T,
}

export type JsonTradeCost = (JsonSingleItemOfComponent<JsonDataComponentExactPredicate> & {
  /**
   * Number of items in the stack.
   * Defaults to `1`.
   */
  count?: JsonNumberProvider,
})
