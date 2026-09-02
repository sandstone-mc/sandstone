import type { JsonItemModifier } from 'sandstone/arguments/generated/_json/data/item_modifier.ts'
import type {
  JsonFloatNumberProviderRef,
} from 'sandstone/arguments/generated/_json/data/number_provider/contextual_float.ts'
import type {
  JsonIntegerNumberProviderRef,
} from 'sandstone/arguments/generated/_json/data/number_provider/contextual_integer.ts'
import type { JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonSlotSource } from 'sandstone/arguments/generated/_json/data/slot_source.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonItemListRef } from 'sandstone/arguments/generated/_json/util/registry_ref.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, LootTableClass, NamespacedString, NBTInt, TagClass } from 'sandstone'

export type JsonBlockEntityTarget = 'block_entity'

export type JsonCompositePoolEntry = ({
  /**
   * Value:
   * List length range: 1..
   */
  children: JsonNBTList<JsonLootPoolEntry, {
    leftExclusive: false,
    min: 1,
  }>,
} & JsonLootPoolEntryBase)

export type JsonDynamicDrops = ('contents' | 'sherds')

export type JsonDynamicPoolEntry = ({
  /**
   * Value:
   *
   *  - Contents(`contents`): Drops the items in a shulker box.
   *  - Sherds(`sherds`): Drops the sherds of a decorated pot.
   */
  name: (JsonDynamicDrops | `minecraft:${JsonDynamicDrops}`),
} & JsonSingletonPoolEntry)

export type JsonEntityTarget = (
  | 'this'
  | 'killer'
  | 'attacker'
  | 'direct_killer'
  | 'direct_attacker'
  | 'killer_player'
  | 'attacking_player'
  | 'target_entity'
  | 'interacting_entity')

export type JsonIntRange = ((NBTInt | number) | JsonIntegerNumberProviderRef | {
  min?: JsonIntegerNumberProviderRef,
  max?: JsonIntegerNumberProviderRef,
})

export type JsonItemPoolEntry = ({
  name: JsonRegistry['minecraft:item'],
} & JsonSingletonPoolEntry)

export type JsonItemStackTarget = 'tool'

export type JsonLootConditionType = (
  | 'alternative'
  | 'block_state_property'
  | 'damage_source_properties'
  | 'entity_properties'
  | 'entity_scores'
  | 'inverted'
  | 'killed_by_player'
  | 'location_check'
  | 'match_tool'
  | 'random_chance'
  | 'random_chance_with_looting'
  | 'reference'
  | 'survives_explosion'
  | 'table_bonus'
  | 'time_check'
  | 'weather_check')

export type JsonLootContextParamSets = (
  | 'empty'
  | 'chest'
  | 'command'
  | 'selector'
  | 'fishing'
  | 'entity'
  | 'gift'
  | 'barter'
  | 'advancement_reward'
  | 'advancement_entity'
  | 'advancement_location'
  | 'generic'
  | 'block'
  | 'block_use'
  | 'equipment'
  | 'archaeology'
  | 'vault'
  | 'shearing'
  | 'enchanted_damage'
  | 'enchanted_item'
  | 'enchanted_location'
  | 'enchanted_entity'
  | 'hit_block'
  | 'block_interact'
  | 'entity_interact'
  | 'villager_trade'
  | 'command_slot_source'
  | 'container_process'
  | 'command_compute_default'
  | 'command_compute_position'
  | 'command_compute_entity')

export type JsonLootEntryType = (
  | 'alternatives'
  | 'dynamic'
  | 'empty'
  | 'group'
  | 'item'
  | 'loot_table'
  | 'sequence'
  | 'tag')

export type JsonLootFunctionType = (
  | 'apply_bonus'
  | 'copy_name'
  | 'copy_nbt'
  | 'copy_state'
  | 'enchant_randomly'
  | 'enchant_with_levels'
  | 'explosion_decay'
  | 'exploration_map'
  | 'fill_player_head'
  | 'furnace_smelt'
  | 'limit_count'
  | 'looting_enchant'
  | 'set_attributes'
  | 'set_contents'
  | 'set_count'
  | 'set_damage'
  | 'set_loot_table'
  | 'set_lore'
  | 'set_name'
  | 'set_nbt'
  | 'set_stew_effect')

export type JsonLootPool = ({
  rolls: JsonIntegerNumberProviderRef,
  bonus_rolls?: JsonFloatNumberProviderRef,
  entries: Array<JsonLootPoolEntry>,
} & {
  modifier?: JsonItemModifier,
  condition?: JsonPredicateRef,
})

export type JsonLootPoolEntry = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:loot_pool_entry_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolLootPoolEntry ? JsonSymbolLootPoolEntry[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:loot_pool_entry_type'], string>])>

export type JsonLootPoolEntryBase = {
  modifier?: JsonItemModifier,
  condition?: JsonPredicateRef,
}

export type JsonLootTable = {
  /**
   * Value:
   *
   *  - Empty(`empty`)
   *  - Chest(`chest`)
   *  - Command(`command`)
   *  - Selector(`selector`)
   *  - Fishing(`fishing`)
   *  - Entity(`entity`)
   *  - Gift(`gift`)
   *  - Barter(`barter`)
   *  - AdvancementReward(`advancement_reward`)
   *  - AdvancementEntity(`advancement_entity`)
   *  - AdvancementLocation(`advancement_location`)
   *  - Generic(`generic`)
   *  - Block(`block`)
   *  - BlockUse(`block_use`)
   *  - Equipment(`equipment`)
   *  - Archaeology(`archaeology`)
   *  - Vault(`vault`)
   *  - Shearing(`shearing`)
   *  - EnchantedDamage(`enchanted_damage`)
   *  - EnchantedItem(`enchanted_item`)
   *  - EnchantedLocation(`enchanted_location`)
   *  - EnchantedEntity(`enchanted_entity`)
   *  - HitBlock(`hit_block`)
   *  - BlockInteract(`block_interact`)
   *  - EntityInteract(`entity_interact`)
   *  - VillagerTrade(`villager_trade`)
   *  - CommandSlotSource(`command_slot_source`)
   *  - ContainerProcess(`container_process`)
   *  - CommandComputeDefault(`command_compute_default`)
   *  - CommandComputePosition(`command_compute_position`)
   *  - CommandComputeEntity(`command_compute_entity`)
   */
  type?: (JsonLootContextParamSets | `minecraft:${JsonLootContextParamSets}`),
  pools?: Array<JsonLootPool>,
  modifier?: JsonItemModifier,
  /**
   * Value:
   *
   * Value: Defines a `random_sequence` id.
   */
  random_sequence?: NamespacedString,
}

export type JsonLootTableListRef = (
  | JsonLootTable | (
  JsonRegistry['minecraft:loot_table'] | `#${string}:${string}` | TagClass<'loot_table'> | LootTableClass)
  | Array<((JsonRegistry['minecraft:loot_table'] | LootTableClass) | JsonLootTable)>)

export type JsonLootTablePoolEntry = ({
  value: JsonLootTableListRef,
  /**
   * If `true`, each of the loot tables becomes an independent entry in the pool with the same `weight` and `quality`. \
   * If `false`, drops all loot tables. \
   * Defaults to `false`.
   */
  expand?: boolean,
} & JsonSingletonPoolEntry)

export type JsonLootTableRef = (JsonLootTable | (JsonRegistry['minecraft:loot_table'] | LootTableClass))

export type JsonSingletonPoolEntry = ({
  /**
   * Value:
   * Range: 1..
   */
  weight?: (NBTInt<{
    min: 1,
  }> | number),
  quality?: (NBTInt | number),
} & JsonLootPoolEntryBase)

export type JsonSlotsPoolEntry = ({
  slot_source: JsonSlotSource,
} & JsonSingletonPoolEntry)

export type JsonTagPoolEntry = ({
  items: JsonItemListRef,
} & {
  /**
   * If `true`, each of the items becomes an independent entry in the pool with the same `weight` and `quality`. \
   * If `false`, drops all items in the tag. \
   * Defaults to `false`.
   */
  expand?: boolean,
} & JsonSingletonPoolEntry)
type JsonLootPoolEntryDispatcherMap = {
  'alternatives': JsonLootPoolEntryAlternatives,
  'minecraft:alternatives': JsonLootPoolEntryAlternatives,
  'dynamic': JsonLootPoolEntryDynamic,
  'minecraft:dynamic': JsonLootPoolEntryDynamic,
  'empty': JsonLootPoolEntryEmpty,
  'minecraft:empty': JsonLootPoolEntryEmpty,
  'group': JsonLootPoolEntryGroup,
  'minecraft:group': JsonLootPoolEntryGroup,
  'item': JsonLootPoolEntryItem,
  'minecraft:item': JsonLootPoolEntryItem,
  'loot_table': JsonLootPoolEntryLootTable,
  'minecraft:loot_table': JsonLootPoolEntryLootTable,
  'sequence': JsonLootPoolEntrySequence,
  'minecraft:sequence': JsonLootPoolEntrySequence,
  'slots': JsonLootPoolEntrySlots,
  'minecraft:slots': JsonLootPoolEntrySlots,
  'tag': JsonLootPoolEntryTag,
  'minecraft:tag': JsonLootPoolEntryTag,
}
type JsonLootPoolEntryKeys = keyof JsonLootPoolEntryDispatcherMap
type JsonLootPoolEntryFallback = (
  | JsonLootPoolEntryAlternatives
  | JsonLootPoolEntryDynamic
  | JsonLootPoolEntryEmpty
  | JsonLootPoolEntryGroup
  | JsonLootPoolEntryItem
  | JsonLootPoolEntryLootTable
  | JsonLootPoolEntrySequence
  | JsonLootPoolEntrySlots
  | JsonLootPoolEntryTag)
type JsonLootPoolEntryAlternatives = JsonCompositePoolEntry
type JsonLootPoolEntryDynamic = JsonDynamicPoolEntry
type JsonLootPoolEntryEmpty = JsonSingletonPoolEntry
type JsonLootPoolEntryGroup = JsonCompositePoolEntry
type JsonLootPoolEntryItem = JsonItemPoolEntry
type JsonLootPoolEntryLootTable = JsonLootTablePoolEntry
type JsonLootPoolEntrySequence = JsonCompositePoolEntry
type JsonLootPoolEntrySlots = JsonSlotsPoolEntry
type JsonLootPoolEntryTag = JsonTagPoolEntry
export type JsonSymbolLootPoolEntry<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonLootPoolEntryDispatcherMap
  : CASE extends 'keys' ? JsonLootPoolEntryKeys : CASE extends '%fallback' ? JsonLootPoolEntryFallback : never
