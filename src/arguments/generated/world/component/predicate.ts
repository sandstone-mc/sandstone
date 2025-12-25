import type { EnchantmentPredicate, ItemPredicate } from 'sandstone/arguments/generated/data/advancement/predicate'
import type { MinMaxBounds } from 'sandstone/arguments/generated/data/util'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { AttributeOperation } from 'sandstone/arguments/generated/util/attribute'
import type { EquipmentSlotGroup } from 'sandstone/arguments/generated/util/slot'
import type { Text } from 'sandstone/arguments/generated/util/text'
import type { CustomData } from 'sandstone/arguments/generated/world/component'
import type { FireworkShape } from 'sandstone/arguments/generated/world/component/item'
import type { NBTDouble, NBTInt, TagClass } from 'sandstone'

export type AttributeModifiersPredicate = {
  modifiers?: CollectionPredicate<AttributeModifiersPredicateEntry>
}

export type AttributeModifiersPredicateEntry = {
  attribute?: ((
      | Registry['minecraft:attribute'] | `#${string}:${string}` | TagClass<'attribute'>)
      | Array<Registry['minecraft:attribute']>)
  id?: `${string}:${string}`
  amount?: MinMaxBounds<(NBTDouble | number)>
  /**
     * Value:
     *
     *  - AddValue(`add_value`): Adds all of the modifiers' amounts to the current value of the attribute.
     *  - AddMultipliedBase(`add_multiplied_base`):
     *    Multiplies the current value of the attribute by `(1 + x)`,
     *    where `x` is the sum of the modifiers' amounts.
     *  - AddMultipliedTotal(`add_multiplied_total`):
     *    For every modifier, multiplies the current value of the attribute by `(1 + x)`,
     *    where `x` is the amount of the particular modifier.
     */
  operation?: AttributeOperation
  /**
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
  slot?: EquipmentSlotGroup
}

export type BundleContentsPredicate = {
  items?: CollectionPredicate<ItemPredicate>
}

export type CollectionPredicate<P> = {
  /**
     * A list of tests. For each test, there must be at least one entry whose contents match exactly.
     */
  contains?: Array<P>
  count?: Array<{
    /**
         * The contents an entry's text must match exactly.
         */
    test: P
    /**
         * The number of entries that must match the test.
         */
    count: MinMaxBounds<NBTInt>
  }>
  /**
     * When set, total number of entries in the this collection.
     */
  size?: MinMaxBounds<NBTInt>
}

export type ContainerPredicate = {
  items?: CollectionPredicate<ItemPredicate>
}

export type FireworkExplosionPredicate = {
  /**
     * Value:
     *
     *  - SmallBall(`small_ball`)
     *  - LargeBall(`large_ball`)
     *  - Star(`star`)
     *  - Creeper(`creeper`)
     *  - Burst(`burst`)
     */
  shape?: FireworkShape
  has_twinkle?: boolean
  has_trail?: boolean
}

export type FireworksPredicate = {
  explosions?: CollectionPredicate<FireworkExplosionPredicate>
  flight_duration?: MinMaxBounds<NBTInt>
}

export type ItemDamagePredicate = {
  damage?: MinMaxBounds<NBTInt>
  durability?: MinMaxBounds<NBTInt>
}

export type JukeboxPlayablePredicate = {
  song?: ((
      | Registry['minecraft:jukebox_song'] | `#${string}:${string}` | TagClass<'jukebox_song'>)
      | Array<Registry['minecraft:jukebox_song']>)
}

export type TrimPredicate = {
  material?: ((
      | Registry['minecraft:trim_material'] | `#${string}:${string}` | TagClass<'trim_material'>)
      | Array<Registry['minecraft:trim_material']>)
  pattern?: ((
      | Registry['minecraft:trim_pattern'] | `#${string}:${string}` | TagClass<'trim_pattern'>)
      | Array<Registry['minecraft:trim_pattern']>)
}

export type WritableBookPredicate = {
  /**
     * Matches the raw text, instead of filtered.
     */
  pages?: CollectionPredicate<string>
}

export type WrittenBookPredicate = {
  /**
     * Matches the raw text, instead of filtered.
     */
  pages?: CollectionPredicate<Text>
  author?: string
  title?: string
  generation?: MinMaxBounds<NBTInt>
  resolved?: boolean
}
type DataComponentPredicateDispatcherMap = {
  'attribute_modifiers': DataComponentPredicateAttributeModifiers
  'minecraft:attribute_modifiers': DataComponentPredicateAttributeModifiers
  'bundle_contents': DataComponentPredicateBundleContents
  'minecraft:bundle_contents': DataComponentPredicateBundleContents
  'container': DataComponentPredicateContainer
  'minecraft:container': DataComponentPredicateContainer
  'custom_data': DataComponentPredicateCustomData
  'minecraft:custom_data': DataComponentPredicateCustomData
  'damage': DataComponentPredicateDamage
  'minecraft:damage': DataComponentPredicateDamage
  'enchantments': DataComponentPredicateEnchantments
  'minecraft:enchantments': DataComponentPredicateEnchantments
  'firework_explosion': DataComponentPredicateFireworkExplosion
  'minecraft:firework_explosion': DataComponentPredicateFireworkExplosion
  'fireworks': DataComponentPredicateFireworks
  'minecraft:fireworks': DataComponentPredicateFireworks
  'jukebox_playable': DataComponentPredicateJukeboxPlayable
  'minecraft:jukebox_playable': DataComponentPredicateJukeboxPlayable
  'potion_contents': DataComponentPredicatePotionContents
  'minecraft:potion_contents': DataComponentPredicatePotionContents
  'stored_enchantments': DataComponentPredicateStoredEnchantments
  'minecraft:stored_enchantments': DataComponentPredicateStoredEnchantments
  'trim': DataComponentPredicateTrim
  'minecraft:trim': DataComponentPredicateTrim
  'writable_book_content': DataComponentPredicateWritableBookContent
  'minecraft:writable_book_content': DataComponentPredicateWritableBookContent
  'written_book_content': DataComponentPredicateWrittenBookContent
  'minecraft:written_book_content': DataComponentPredicateWrittenBookContent
}
type DataComponentPredicateKeys = keyof DataComponentPredicateDispatcherMap
type DataComponentPredicateFallback = (
  | DataComponentPredicateAttributeModifiers
  | DataComponentPredicateBundleContents
  | DataComponentPredicateContainer
  | DataComponentPredicateCustomData
  | DataComponentPredicateDamage
  | DataComponentPredicateEnchantments
  | DataComponentPredicateFireworkExplosion
  | DataComponentPredicateFireworks
  | DataComponentPredicateJukeboxPlayable
  | DataComponentPredicatePotionContents
  | DataComponentPredicateStoredEnchantments
  | DataComponentPredicateTrim
  | DataComponentPredicateWritableBookContent
  | DataComponentPredicateWrittenBookContent
  | DataComponentPredicateFallbackType)
type DataComponentPredicateFallbackType = never
type DataComponentPredicateAttributeModifiers = AttributeModifiersPredicate
type DataComponentPredicateBundleContents = BundleContentsPredicate
type DataComponentPredicateContainer = ContainerPredicate
type DataComponentPredicateCustomData = CustomData
type DataComponentPredicateDamage = ItemDamagePredicate
type DataComponentPredicateEnchantments = Array<EnchantmentPredicate>
type DataComponentPredicateFireworkExplosion = FireworkExplosionPredicate
type DataComponentPredicateFireworks = FireworksPredicate
type DataComponentPredicateJukeboxPlayable = JukeboxPlayablePredicate
type DataComponentPredicatePotionContents = ((
  | Registry['minecraft:potion'] | `#${Registry['minecraft:tag/potion']}` | TagClass<'potion'>)
  | Array<Registry['minecraft:potion']>)
type DataComponentPredicateStoredEnchantments = Array<EnchantmentPredicate>
type DataComponentPredicateTrim = TrimPredicate
type DataComponentPredicateWritableBookContent = WritableBookPredicate
type DataComponentPredicateWrittenBookContent = WrittenBookPredicate
export type SymbolDataComponentPredicate<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? DataComponentPredicateDispatcherMap
  : CASE extends 'keys'
    ? DataComponentPredicateKeys
    : CASE extends '%fallback' ? DataComponentPredicateFallback : never
