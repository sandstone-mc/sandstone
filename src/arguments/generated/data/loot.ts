import type { NumberProvider } from 'sandstone/arguments/generated/data/util'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { SlotSource } from 'sandstone/arguments/generated/util/slot'
import type { NBTInt } from 'sandstone'

export type BlockEntityTarget = 'block_entity'

export type CompositePoolEntry = ({
  children: Array<LootPoolEntry>
} & LootPoolEntryBase)

export type DynamicDrops = ('contents' | 'sherds')

export type DynamicPoolEntry = ({
  /**
     * Value:
     *
     *  - Contents(`contents`): Drops the items in a shulker box.
     *  - Sherds(`sherds`): Drops the sherds of a decorated pot.
     */
  name: (DynamicDrops | `minecraft:${DynamicDrops}`)
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
  name: Registry['minecraft:item']
} & SingletonPoolEntry)

export type ItemStackTarget = 'tool'

export type LootCondition = ({
  [S in Extract<Registry['minecraft:loot_condition_type'], string>]?: ({
    condition: S
  } & (S extends keyof Dispatcher<'minecraft:loot_condition'>
    ? Dispatcher<'minecraft:loot_condition'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:loot_condition_type']])

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

export type LootContextType = (
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
  | 'entity_interact')

export type LootEntryType = (
  | 'alternatives'
  | 'dynamic'
  | 'empty'
  | 'group'
  | 'item'
  | 'loot_table'
  | 'sequence'
  | 'tag')

export type LootFunction = ({
  [S in Extract<Registry['minecraft:loot_function_type'], string>]?: ({
    function: S
  } & (S extends keyof Dispatcher<'minecraft:loot_function'>
    ? Dispatcher<'minecraft:loot_function'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:loot_function_type']])

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

export type LootPool = {
  rolls: NumberProvider
  bonus_rolls?: NumberProvider
  entries: Array<LootPoolEntry>
  functions?: Array<LootFunction>
  conditions?: Array<LootCondition>
}

export type LootPoolEntry = ({
  [S in Extract<Registry['minecraft:loot_pool_entry_type'], string>]?: ({
    type: S
  } & (S extends keyof Dispatcher<'minecraft:loot_pool_entry'>
    ? Dispatcher<'minecraft:loot_pool_entry'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:loot_pool_entry_type']])

export type LootPoolEntryBase = {
  conditions?: Array<LootCondition>
}

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
     */
  type?: (LootContextType | `minecraft:${LootContextType}`)
  pools?: Array<LootPool>
  functions?: Array<LootFunction>
  /**
     * Value:
     *
     * Value: Defines a `minecraft:random_sequence` id.
     */
  random_sequence?: `${string}:${string}`
}

export type LootTablePoolEntry = ({
  value: (Registry['minecraft:loot_table'] | LootTable)
} & SingletonPoolEntry)

export type SingletonPoolEntry = ({
  /**
     * Value:
     * Range: 1..
     */
  weight?: NBTInt<{
    min: 1
  }>
  quality?: NBTInt
  functions?: Array<LootFunction>
} & LootPoolEntryBase)

export type SlotsPoolEntry = ({
  slot_source: SlotSource
} & SingletonPoolEntry)

export type TagPoolEntry = ({
  name: (Registry['minecraft:tag/item'])
  /**
     * If `true`, drops a random item from the tag. If `false`, drops all items in the tag.
     */
  expand: boolean
} & SingletonPoolEntry)
type LootPoolEntryDispatcherMap = {
  'alternatives': LootPoolEntryAlternatives
  'minecraft:alternatives': LootPoolEntryAlternatives
  'dynamic': LootPoolEntryDynamic
  'minecraft:dynamic': LootPoolEntryDynamic
  'empty': LootPoolEntryEmpty
  'minecraft:empty': LootPoolEntryEmpty
  'group': LootPoolEntryGroup
  'minecraft:group': LootPoolEntryGroup
  'item': LootPoolEntryItem
  'minecraft:item': LootPoolEntryItem
  'loot_table': LootPoolEntryLootTable
  'minecraft:loot_table': LootPoolEntryLootTable
  'sequence': LootPoolEntrySequence
  'minecraft:sequence': LootPoolEntrySequence
  'slots': LootPoolEntrySlots
  'minecraft:slots': LootPoolEntrySlots
  'tag': LootPoolEntryTag
  'minecraft:tag': LootPoolEntryTag
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
  | '%none' = 'map'> = CASE extends 'map'
  ? LootPoolEntryDispatcherMap
  : CASE extends 'keys' ? LootPoolEntryKeys : CASE extends '%fallback' ? LootPoolEntryFallback : never
