import type { ItemModifier } from 'sandstone/arguments/generated/data/item_modifier.ts'
import type { LootCondition } from 'sandstone/arguments/generated/data/loot/condition.ts'
import type { LootFunction } from 'sandstone/arguments/generated/data/loot/function.ts'
import type { NumberProviderRef } from 'sandstone/arguments/generated/data/number_provider.ts'
import type { PredicateRef } from 'sandstone/arguments/generated/data/predicate.ts'
import type { SlotSource } from 'sandstone/arguments/generated/data/slot_source.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ItemListRef } from 'sandstone/arguments/generated/util/registry_ref.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { LootTableClass, NBTInt, NBTList, TagClass } from 'sandstone'

export type BlockEntityTarget = 'block_entity'

export type CompositePoolEntry = ({
  /**
   * Value:
   * List length range: 1..
   */
  children: NBTList<LootPoolEntry, {
    leftExclusive: false,
    min: 1,
  }>,
} & LootPoolEntryBase)

export type DynamicDrops = ('contents' | 'sherds')

export type DynamicPoolEntry = ({
  /**
   * Value:
   *
   *  - Contents(`contents`): Drops the items in a shulker box.
   *  - Sherds(`sherds`): Drops the sherds of a decorated pot.
   */
  name: (DynamicDrops | `minecraft:${DynamicDrops}`),
} & SingletonPoolEntry)

export type EntityTarget = (
  | 'this'
  | 'killer'
  | 'attacker'
  | 'direct_killer'
  | 'direct_attacker'
  | 'killer_player'
  | 'attacking_player'
  | 'target_entity'
  | 'interacting_entity')

export type ItemPoolEntry = ({
  name: Registry['minecraft:item'],
} & SingletonPoolEntry)

export type ItemStackTarget = 'tool'

export type LootConditionType = (
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

export type LootContextParamSets = (
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
  | 'container_process')

export type LootEntryType = (
  | 'alternatives'
  | 'dynamic'
  | 'empty'
  | 'group'
  | 'item'
  | 'loot_table'
  | 'sequence'
  | 'tag')

export type LootFunctionType = (
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

export type LootPool = ({
  rolls: NumberProviderRef,
  bonus_rolls?: NumberProviderRef,
  entries: Array<LootPoolEntry>,
} & {
  functions?: Array<LootFunction>,
  conditions?: Array<LootCondition>,
} & {
  modifier?: ItemModifier,
  condition?: PredicateRef,
})

export type LootPoolEntry = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:loot_pool_entry_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolLootPoolEntry ? SymbolLootPoolEntry[S] : RootNBT))
}[Extract<Registry['minecraft:loot_pool_entry_type'], string>])>

export type LootPoolEntryBase = ({
  conditions?: Array<LootCondition>,
} & {
  modifier?: ItemModifier,
  condition?: PredicateRef,
})

export type LootTable = {
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
   */
  type?: (LootContextParamSets | `minecraft:${LootContextParamSets}`),
  pools?: Array<LootPool>,
  functions?: Array<LootFunction>,
  modifier?: ItemModifier,
  /**
   * Value:
   *
   * Value: Defines a `random_sequence` id.
   */
  random_sequence?: `${string}:${string}`,
}

export type LootTableListRef = (
  | Array<LootTable>
  | LootTable | (
  Registry['minecraft:loot_table'] | `#${string}:${string}` | TagClass<'loot_table'> | LootTableClass)
  | Array<((Registry['minecraft:loot_table'] | LootTableClass) | LootTable)>)

export type LootTablePoolEntry = ({
  value: ((Registry['minecraft:loot_table'] | LootTableClass) | LootTable | LootTableListRef),
  /**
   * If `true`, randomly selects a loot table to drop. \
   * If `false`, drops all loot tables. \
   * Defaults to `false`.
   */
  expand?: boolean,
} & SingletonPoolEntry)

export type LootTableRef = (LootTable | (Registry['minecraft:loot_table'] | LootTableClass))

export type SingletonPoolEntry = ({
  /**
   * Value:
   * Range: 1..
   */
  weight?: NBTInt<{
    min: 1,
  }>,
  quality?: NBTInt,
  functions?: Array<LootFunction>,
} & LootPoolEntryBase)

export type SlotsPoolEntry = ({
  slot_source: SlotSource,
} & SingletonPoolEntry)

export type TagPoolEntry = ({
  name: (Registry['minecraft:tag/item']),
  items: ItemListRef,
} & {
  /**
   * If `true`, drops a random item from the tag. \
   * If `false`, drops all items in the tag.
   */
  expand: boolean,
} & {
  /**
   * If `true`, randomly selects an item to drop. \
   * If `false`, drops all items. \
   * Defaults to `false`.
   */
  expand?: boolean,
} & SingletonPoolEntry)
type LootPoolEntryDispatcherMap = {
  'alternatives': LootPoolEntryAlternatives,
  'minecraft:alternatives': LootPoolEntryAlternatives,
  'dynamic': LootPoolEntryDynamic,
  'minecraft:dynamic': LootPoolEntryDynamic,
  'empty': LootPoolEntryEmpty,
  'minecraft:empty': LootPoolEntryEmpty,
  'group': LootPoolEntryGroup,
  'minecraft:group': LootPoolEntryGroup,
  'item': LootPoolEntryItem,
  'minecraft:item': LootPoolEntryItem,
  'loot_table': LootPoolEntryLootTable,
  'minecraft:loot_table': LootPoolEntryLootTable,
  'sequence': LootPoolEntrySequence,
  'minecraft:sequence': LootPoolEntrySequence,
  'slots': LootPoolEntrySlots,
  'minecraft:slots': LootPoolEntrySlots,
  'tag': LootPoolEntryTag,
  'minecraft:tag': LootPoolEntryTag,
}
type LootPoolEntryKeys = keyof LootPoolEntryDispatcherMap
type LootPoolEntryFallback = (
  | LootPoolEntryAlternatives
  | LootPoolEntryDynamic
  | LootPoolEntryEmpty
  | LootPoolEntryGroup
  | LootPoolEntryItem
  | LootPoolEntryLootTable
  | LootPoolEntrySequence
  | LootPoolEntrySlots
  | LootPoolEntryTag)
type LootPoolEntryAlternatives = CompositePoolEntry
type LootPoolEntryDynamic = DynamicPoolEntry
type LootPoolEntryEmpty = SingletonPoolEntry
type LootPoolEntryGroup = CompositePoolEntry
type LootPoolEntryItem = ItemPoolEntry
type LootPoolEntryLootTable = LootTablePoolEntry
type LootPoolEntrySequence = CompositePoolEntry
type LootPoolEntrySlots = SlotsPoolEntry
type LootPoolEntryTag = TagPoolEntry
export type SymbolLootPoolEntry<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? LootPoolEntryDispatcherMap
  : CASE extends 'keys' ? LootPoolEntryKeys : CASE extends '%fallback' ? LootPoolEntryFallback : never
