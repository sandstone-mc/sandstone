import type {
  JsonEnchantmentPredicate,
  JsonEntityEffectsPredicate,
  JsonItemPredicate,
} from 'sandstone/arguments/generated/_json/data/advancement/predicate.ts'
import type { JsonMinMaxBounds } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonAttributeOperation } from 'sandstone/arguments/generated/_json/util/attribute.ts'
import type { JsonEquipmentSlotGroup } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonFireworkShape } from 'sandstone/arguments/generated/_json/world/component/item.ts'
import type { JsonCustomData } from 'sandstone/arguments/generated/_json/world/component.ts'
import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type {
  JukeboxSongClass,
  NamespacedString,
  NBTDouble,
  NBTInt,
  TagClass,
  TrimMaterialClass,
  TrimPatternClass,
} from 'sandstone'

export type JsonAttributeModifiersPredicate = {
  modifiers?: JsonCollectionPredicate<JsonAttributeModifiersPredicateEntry>,
}

export type JsonAttributeModifiersPredicateEntry = {
  attribute?: ((
      | JsonRegistry['minecraft:attribute'] | `#${string}:${string}` | TagClass<'attribute'>)
      | Array<JsonRegistry['minecraft:attribute']>),
  id?: NamespacedString,
  amount?: JsonMinMaxBounds<(NBTDouble | number)>,
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
  operation?: JsonAttributeOperation,
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
  slot?: JsonEquipmentSlotGroup,
}

export type JsonBundleContentsPredicate = {
  items?: JsonCollectionPredicate<JsonItemPredicate>,
}

export type JsonCollectionPredicate<P extends JsonNBTObject> = {
  /**
   * A list of tests. For each test, there must be at least one entry whose contents match exactly.
   */
  contains?: Array<P>,
  count?: Array<{
    /**
     * The contents an entry's text must match exactly.
     */
    test: P,
    /**
     * The number of entries that must match the test.
     */
    count: JsonMinMaxBounds<(NBTInt | number)>,
  }>,
  /**
   * When set, total number of entries in the this collection.
   */
  size?: JsonMinMaxBounds<(NBTInt | number)>,
}

export type JsonContainerPredicate = {
  items?: JsonCollectionPredicate<JsonItemPredicate>,
}

export type JsonFireworkExplosionPredicate = {
  /**
   * Value:
   *
   *  - SmallBall(`small_ball`)
   *  - LargeBall(`large_ball`)
   *  - Star(`star`)
   *  - Creeper(`creeper`)
   *  - Burst(`burst`)
   */
  shape?: JsonFireworkShape,
  has_twinkle?: boolean,
  has_trail?: boolean,
}

export type JsonFireworksPredicate = {
  explosions?: JsonCollectionPredicate<JsonFireworkExplosionPredicate>,
  flight_duration?: JsonMinMaxBounds<(NBTInt | number)>,
}

export type JsonItemCountPseudoPredicate = JsonMinMaxBounds<(NBTInt<{
  min: 1,
  max: 99,
}> | number)>

export type JsonItemDamagePredicate = {
  damage?: JsonMinMaxBounds<(NBTInt | number)>,
  durability?: JsonMinMaxBounds<(NBTInt | number)>,
}

export type JsonJukeboxPlayablePredicate = {
  song?: ((
      | JsonRegistry['minecraft:jukebox_song'] | `#${string}:${string}` | TagClass<'jukebox_song'> | JukeboxSongClass)
      | Array<(JsonRegistry['minecraft:jukebox_song'] | JukeboxSongClass)>),
}

export type JsonPotionsPredicate = {
  potions?: JsonPotionTypeMatch,
  effects?: JsonCollectionPredicate<JsonEntityEffectsPredicate>,
}

export type JsonPotionTypeMatch = ((
  | JsonRegistry['minecraft:potion'] | `#${JsonRegistry['minecraft:tag/potion']}` | TagClass<'potion'>)
  | Array<JsonRegistry['minecraft:potion']>)

export type JsonTrimPredicate = {
  material?: ((
        | JsonRegistry['minecraft:trim_material']
        | `#${string}:${string}`
        | TagClass<'trim_material'>
        | TrimMaterialClass)
      | Array<(JsonRegistry['minecraft:trim_material'] | TrimMaterialClass)>),
  pattern?: ((
      | JsonRegistry['minecraft:trim_pattern'] | `#${string}:${string}` | TagClass<'trim_pattern'> | TrimPatternClass)
      | Array<(JsonRegistry['minecraft:trim_pattern'] | TrimPatternClass)>),
}

export type JsonWritableBookPredicate = {
  /**
   * Matches the raw text, instead of filtered.
   */
  pages?: JsonCollectionPredicate<string>,
}

export type JsonWrittenBookPredicate = {
  /**
   * Matches the raw text, instead of filtered.
   */
  pages?: JsonCollectionPredicate<JsonText>,
  author?: string,
  title?: string,
  generation?: JsonMinMaxBounds<(NBTInt | number)>,
  resolved?: boolean,
}
type JsonDataComponentPredicateDispatcherMap = {
  'attribute_modifiers': JsonDataComponentPredicateAttributeModifiers,
  'minecraft:attribute_modifiers': JsonDataComponentPredicateAttributeModifiers,
  'bundle_contents': JsonDataComponentPredicateBundleContents,
  'minecraft:bundle_contents': JsonDataComponentPredicateBundleContents,
  'container': JsonDataComponentPredicateContainer,
  'minecraft:container': JsonDataComponentPredicateContainer,
  'custom_data': JsonDataComponentPredicateCustomData,
  'minecraft:custom_data': JsonDataComponentPredicateCustomData,
  'damage': JsonDataComponentPredicateDamage,
  'minecraft:damage': JsonDataComponentPredicateDamage,
  'enchantments': JsonDataComponentPredicateEnchantments,
  'minecraft:enchantments': JsonDataComponentPredicateEnchantments,
  'firework_explosion': JsonDataComponentPredicateFireworkExplosion,
  'minecraft:firework_explosion': JsonDataComponentPredicateFireworkExplosion,
  'fireworks': JsonDataComponentPredicateFireworks,
  'minecraft:fireworks': JsonDataComponentPredicateFireworks,
  'jukebox_playable': JsonDataComponentPredicateJukeboxPlayable,
  'minecraft:jukebox_playable': JsonDataComponentPredicateJukeboxPlayable,
  'potion_contents': JsonDataComponentPredicatePotionContents,
  'minecraft:potion_contents': JsonDataComponentPredicatePotionContents,
  'stored_enchantments': JsonDataComponentPredicateStoredEnchantments,
  'minecraft:stored_enchantments': JsonDataComponentPredicateStoredEnchantments,
  'trim': JsonDataComponentPredicateTrim,
  'minecraft:trim': JsonDataComponentPredicateTrim,
  'villager/variant': JsonDataComponentPredicateVillagerVariant,
  'minecraft:villager/variant': JsonDataComponentPredicateVillagerVariant,
  'writable_book_content': JsonDataComponentPredicateWritableBookContent,
  'minecraft:writable_book_content': JsonDataComponentPredicateWritableBookContent,
  'written_book_content': JsonDataComponentPredicateWrittenBookContent,
  'minecraft:written_book_content': JsonDataComponentPredicateWrittenBookContent,
}
type JsonDataComponentPredicateKeys = keyof JsonDataComponentPredicateDispatcherMap
type JsonDataComponentPredicateFallback = (
  | JsonDataComponentPredicateAttributeModifiers
  | JsonDataComponentPredicateBundleContents
  | JsonDataComponentPredicateContainer
  | JsonDataComponentPredicateCustomData
  | JsonDataComponentPredicateDamage
  | JsonDataComponentPredicateEnchantments
  | JsonDataComponentPredicateFireworkExplosion
  | JsonDataComponentPredicateFireworks
  | JsonDataComponentPredicateJukeboxPlayable
  | JsonDataComponentPredicatePotionContents
  | JsonDataComponentPredicateStoredEnchantments
  | JsonDataComponentPredicateTrim
  | JsonDataComponentPredicateVillagerVariant
  | JsonDataComponentPredicateWritableBookContent
  | JsonDataComponentPredicateWrittenBookContent
  | JsonDataComponentPredicateFallbackType)
export type JsonDataComponentPredicateFallbackType = never
type JsonDataComponentPredicateAttributeModifiers = JsonAttributeModifiersPredicate
type JsonDataComponentPredicateBundleContents = JsonBundleContentsPredicate
type JsonDataComponentPredicateContainer = JsonContainerPredicate
type JsonDataComponentPredicateCustomData = JsonCustomData
type JsonDataComponentPredicateDamage = JsonItemDamagePredicate
type JsonDataComponentPredicateEnchantments = Array<JsonEnchantmentPredicate>
type JsonDataComponentPredicateFireworkExplosion = JsonFireworkExplosionPredicate
type JsonDataComponentPredicateFireworks = JsonFireworksPredicate
type JsonDataComponentPredicateJukeboxPlayable = JsonJukeboxPlayablePredicate
type JsonDataComponentPredicatePotionContents = JsonPotionsPredicate
type JsonDataComponentPredicateStoredEnchantments = Array<JsonEnchantmentPredicate>
type JsonDataComponentPredicateTrim = JsonTrimPredicate
type JsonDataComponentPredicateVillagerVariant = ((
  | JsonRegistry['minecraft:villager_type'] | `#${string}:${string}` | TagClass<'villager_type'>)
  | Array<JsonRegistry['minecraft:villager_type']>)
type JsonDataComponentPredicateWritableBookContent = JsonWritableBookPredicate
type JsonDataComponentPredicateWrittenBookContent = JsonWrittenBookPredicate
export type JsonSymbolDataComponentPredicate<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonDataComponentPredicateDispatcherMap
  : CASE extends 'keys'
    ? JsonDataComponentPredicateKeys
    : CASE extends '%fallback'
      ? JsonDataComponentPredicateFallback
      : CASE extends '%unknown' ? JsonDataComponentPredicateFallbackType : never
