import type {
    DamageSourcePredicate,
    EntityPredicate,
    ItemPredicate,
    LocationPredicate,
} from 'sandstone/arguments/generated/data/advancement/predicate.js'
import type { LevelBasedValue } from 'sandstone/arguments/generated/data/enchantment/level_based_value.js'
import type { EntityTarget, LootCondition } from 'sandstone/arguments/generated/data/loot.js'
import type { IntRange, NumberProvider } from 'sandstone/arguments/generated/data/util.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { NBTFloat, NBTInt, NBTLong, ObjectiveClass } from 'sandstone'

export type AllOf = {
    /**
     * Passes when all of these conditions pass.
     */
    terms: Array<LootCondition>
}

export type Alternative = {
    terms: Array<LootCondition>
}

export type AnyOf = {
    /**
     * Passes when any of these conditions pass.
     */
    terms: Array<LootCondition>
}

export type BlockStateProperty = ({
    [S in Extract<Registry['minecraft:block'], string>]?: {
        block: S
        properties?: (S extends undefined ? Dispatcher<'mcdoc:block_states', [
            '%none',
        ]> : (S extends keyof Dispatcher<'mcdoc:block_states'>
            ? Dispatcher<'mcdoc:block_states'>[S]
            : Record<string, unknown>))
    };
}[Registry['minecraft:block']])

export type DamageSourceProperties = {
    predicate: DamageSourcePredicate
}

export type EnchantmentActiveCheck = {
    active: boolean
}

export type EntityProperties = {
    /**
     * Value:
     *
     *  - This(`this`)
     *  - Killer(`killer`)
     *  - Attacker(`attacker`)
     *  - DirectKiller(`direct_killer`)
     *  - DirectAttacker(`direct_attacker`)
     *  - KillerPlayer(`killer_player`)
     *  - AttackingPlayer(`attacking_player`)
     *  - TargetEntity(`target_entity`)
     *  - InteractingEntity(`interacting_entity`)
     */
    entity: EntityTarget
    predicate: EntityPredicate
}

export type EntityScores = {
    /**
     * Value:
     *
     *  - This(`this`)
     *  - Killer(`killer`)
     *  - Attacker(`attacker`)
     *  - DirectKiller(`direct_killer`)
     *  - DirectAttacker(`direct_attacker`)
     *  - KillerPlayer(`killer_player`)
     *  - AttackingPlayer(`attacking_player`)
     *  - TargetEntity(`target_entity`)
     *  - InteractingEntity(`interacting_entity`)
     */
    entity: EntityTarget
    scores: ({
        [Key in Extract<string | ObjectiveClass, string>]?: IntRange;
    })
}

export type Inverted = {
    term: LootCondition
}

export type KilledByPlayer = {
    inverse?: boolean
}

export type LocationCheck = {
    offsetX?: NBTInt
    offsetY?: NBTInt
    offsetZ?: NBTInt
    predicate: LocationPredicate
}

export type MatchTool = {
    predicate: ItemPredicate
}

export type RandomChance = {
    /**
     * Clamps to a float between `0` & `1` (inclusive).
     */
    chance: NumberProvider
}

export type RandomChanceWithEnchantedBonus = {
    /**
     * Value:
     * Range: 0..1
     */
    unenchanted_chance: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
    }>
    enchanted_chance: LevelBasedValue
    enchantment: Registry['minecraft:enchantment']
}

export type RandomChanceWithLooting = {
    /**
     * Value:
     * Range: 0..1
     */
    chance: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
    }>
    /**
     * Looting adjustment to the base success rate. Formula is `chance + (looting_level * looting_multiplier)` .
     */
    looting_multiplier: NBTFloat
}

export type Reference = {
    /**
     * A cyclic reference causes a parsing failure.
     */
    name: `${string}:${string}`
}

export type TableBonus = {
    enchantment: Registry['minecraft:enchantment']
    /**
     * Probabilities for each enchantment level
     */
    chances: Array<NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
    }>>
}

export type TimeCheck = {
    /**
     * Check the current game tick.
     */
    value: IntRange
    /**
     * Game tick supplied to `value` check gets modulo-divided by this.
     * For example, if set to 24000, `value` operates on a time period of days.
     */
    period?: NBTLong
}

export type ValueCheck = {
    /**
     * Clamps to an integer.
     */
    value: NumberProvider
    /**
     * Passes when `value` is within this range.
     */
    range: IntRange
}

export type WeatherCheck = {
    raining?: boolean
    thundering?: boolean
}
type LootConditionDispatcherMap = {
    'all_of': LootConditionAllOf
    'minecraft:all_of': LootConditionAllOf
    'alternative': LootConditionAlternative
    'minecraft:alternative': LootConditionAlternative
    'any_of': LootConditionAnyOf
    'minecraft:any_of': LootConditionAnyOf
    'block_state_property': LootConditionBlockStateProperty
    'minecraft:block_state_property': LootConditionBlockStateProperty
    'damage_source_properties': LootConditionDamageSourceProperties
    'minecraft:damage_source_properties': LootConditionDamageSourceProperties
    'enchantment_active_check': LootConditionEnchantmentActiveCheck
    'minecraft:enchantment_active_check': LootConditionEnchantmentActiveCheck
    'entity_properties': LootConditionEntityProperties
    'minecraft:entity_properties': LootConditionEntityProperties
    'entity_scores': LootConditionEntityScores
    'minecraft:entity_scores': LootConditionEntityScores
    'inverted': LootConditionInverted
    'minecraft:inverted': LootConditionInverted
    'killed_by_player': LootConditionKilledByPlayer
    'minecraft:killed_by_player': LootConditionKilledByPlayer
    'location_check': LootConditionLocationCheck
    'minecraft:location_check': LootConditionLocationCheck
    'match_tool': LootConditionMatchTool
    'minecraft:match_tool': LootConditionMatchTool
    'random_chance': LootConditionRandomChance
    'minecraft:random_chance': LootConditionRandomChance
    'random_chance_with_enchanted_bonus': LootConditionRandomChanceWithEnchantedBonus
    'minecraft:random_chance_with_enchanted_bonus': LootConditionRandomChanceWithEnchantedBonus
    'random_chance_with_looting': LootConditionRandomChanceWithLooting
    'minecraft:random_chance_with_looting': LootConditionRandomChanceWithLooting
    'reference': LootConditionReference
    'minecraft:reference': LootConditionReference
    'table_bonus': LootConditionTableBonus
    'minecraft:table_bonus': LootConditionTableBonus
    'time_check': LootConditionTimeCheck
    'minecraft:time_check': LootConditionTimeCheck
    'value_check': LootConditionValueCheck
    'minecraft:value_check': LootConditionValueCheck
    'weather_check': LootConditionWeatherCheck
    'minecraft:weather_check': LootConditionWeatherCheck
}
type LootConditionKeys = keyof LootConditionDispatcherMap
type LootConditionFallback = (
  | LootConditionAllOf
  | LootConditionAlternative
  | LootConditionAnyOf
  | LootConditionBlockStateProperty
  | LootConditionDamageSourceProperties
  | LootConditionEnchantmentActiveCheck
  | LootConditionEntityProperties
  | LootConditionEntityScores
  | LootConditionInverted
  | LootConditionKilledByPlayer
  | LootConditionLocationCheck
  | LootConditionMatchTool
  | LootConditionRandomChance
  | LootConditionRandomChanceWithEnchantedBonus
  | LootConditionRandomChanceWithLooting
  | LootConditionReference
  | LootConditionTableBonus
  | LootConditionTimeCheck
  | LootConditionValueCheck
  | LootConditionWeatherCheck)
type LootConditionAllOf = AllOf
type LootConditionAlternative = Alternative
type LootConditionAnyOf = AnyOf
type LootConditionBlockStateProperty = BlockStateProperty
type LootConditionDamageSourceProperties = DamageSourceProperties
type LootConditionEnchantmentActiveCheck = EnchantmentActiveCheck
type LootConditionEntityProperties = EntityProperties
type LootConditionEntityScores = EntityScores
type LootConditionInverted = Inverted
type LootConditionKilledByPlayer = KilledByPlayer
type LootConditionLocationCheck = LocationCheck
type LootConditionMatchTool = MatchTool
type LootConditionRandomChance = RandomChance
type LootConditionRandomChanceWithEnchantedBonus = RandomChanceWithEnchantedBonus
type LootConditionRandomChanceWithLooting = RandomChanceWithLooting
type LootConditionReference = Reference
type LootConditionTableBonus = TableBonus
type LootConditionTimeCheck = TimeCheck
type LootConditionValueCheck = ValueCheck
type LootConditionWeatherCheck = WeatherCheck
export type SymbolLootCondition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? LootConditionDispatcherMap
    : CASE extends 'keys' ? LootConditionKeys : CASE extends '%fallback' ? LootConditionFallback : never
