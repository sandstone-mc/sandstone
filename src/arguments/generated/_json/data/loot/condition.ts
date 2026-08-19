import type {
  JsonBlockPredicate,
  JsonDamageSourcePredicate,
  JsonEntityPredicate,
  JsonItemPredicate,
  JsonLocationPredicate,
} from 'sandstone/arguments/generated/_json/data/advancement/predicate.ts'
import type { JsonLevelBasedValue } from 'sandstone/arguments/generated/_json/data/enchantment/level_based_value.ts'
import type { JsonEntityTarget } from 'sandstone/arguments/generated/_json/data/loot.ts'
import type { JsonNumberProviderRef } from 'sandstone/arguments/generated/_json/data/number_provider.ts'
import type { JsonPredicateListRef, JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonIntRange } from 'sandstone/arguments/generated/_json/data/util.ts'
import type {
  JsonSymbolEnvironmentAttribute,
  JsonSymbolMcdocBlockStates,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  EnchantmentClass,
  NBTFloat,
  NBTInt,
  NBTLong,
  ObjectiveClass,
  PredicateClass,
  WorldClockClass,
} from 'sandstone'

export type JsonAllOf = {
  /**
   * Passes when all of these conditions pass.
   */
  terms: JsonPredicateListRef,
}

export type JsonAlternative = {
  terms: Array<JsonLootCondition>,
}

export type JsonAnyOf = {
  /**
   * Passes when any of these conditions pass.
   */
  terms: JsonPredicateListRef,
}

export type JsonBlockStateProperty = {
  block: JsonRegistry['minecraft:block'],
  properties?: JsonSymbolMcdocBlockStates<'%none'>,
}

export type JsonDamageSourceProperties = {
  predicate: JsonDamageSourcePredicate,
}

export type JsonEnchantmentActiveCheck = {
  active: boolean,
}

export type JsonEntityProperties = {
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
  entity: JsonEntityTarget,
  predicate: JsonEntityPredicate,
}

export type JsonEntityScores = {
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
  entity: JsonEntityTarget,
  scores: ({
    [Key in Extract<string | ObjectiveClass, string>]?: JsonIntRange
  }),
}

export type JsonEnvironmentAttributeCheck = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:environment_attribute'], string>, string>]?: {
    attribute: S,
    value: (S extends keyof JsonSymbolEnvironmentAttribute
      ? JsonSymbolEnvironmentAttribute[S]
      : JsonSymbolEnvironmentAttribute<'%unknown'>),
  }
}[Extract<JsonRegistry['minecraft:environment_attribute'], string>])>

export type JsonInverted = {
  term: JsonPredicateRef,
}

export type JsonKilledByPlayer = {
  inverse?: boolean,
}

export type JsonLocationCheck = {
  offsetX?: (NBTInt | number),
  offsetY?: (NBTInt | number),
  offsetZ?: (NBTInt | number),
  predicate: JsonLocationPredicate,
}

export type JsonLootCondition = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:loot_condition_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolLootCondition ? JsonSymbolLootCondition[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:loot_condition_type'], string>])>

export type JsonMatchTool = {
  predicate: JsonItemPredicate,
}

export type JsonRandomChance = {
  /**
   * Clamps to a float between `0` & `1` (inclusive).
   */
  chance: JsonNumberProviderRef,
}

export type JsonRandomChanceWithEnchantedBonus = {
  /**
   * Value:
   * Range: 0..1
   */
  unenchanted_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  enchanted_chance: JsonLevelBasedValue,
  enchantment: (JsonRegistry['minecraft:enchantment'] | EnchantmentClass),
}

export type JsonRandomChanceWithLooting = {
  /**
   * Value:
   * Range: 0..1
   */
  chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Looting adjustment to the base success rate. Formula is `chance + (looting_level * looting_multiplier)` .
   */
  looting_multiplier: (NBTFloat | number),
}

export type JsonReference = {
  /**
   * A cyclic reference causes a parsing failure.
   */
  name: (JsonRegistry['minecraft:predicate'] | PredicateClass),
}

export type JsonTableBonus = {
  enchantment: (JsonRegistry['minecraft:enchantment'] | EnchantmentClass),
  /**
   * Probabilities for each enchantment level
   */
  chances: Array<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number)>,
}

export type JsonTimeCheck = {
  /**
   * The world clock to check.
   */
  clock: (JsonRegistry['minecraft:world_clock'] | WorldClockClass),
  /**
   * Check the current game tick.
   */
  value: JsonIntRange,
  /**
   * Game tick supplied to `value` check gets modulo-divided by this.
   * For example, if set to 24000, `value` operates on a time period of days.
   */
  period?: (NBTLong | number),
}

export type JsonValueCheck = {
  /**
   * Clamps to an integer.
   */
  value: JsonNumberProviderRef,
  /**
   * Passes when `value` is within this range.
   */
  range: JsonIntRange,
}

export type JsonWeatherCheck = {
  raining?: boolean,
  thundering?: boolean,
}
type JsonLootConditionDispatcherMap = {
  'all_of': JsonLootConditionAllOf,
  'minecraft:all_of': JsonLootConditionAllOf,
  'any_of': JsonLootConditionAnyOf,
  'minecraft:any_of': JsonLootConditionAnyOf,
  'damage_source_properties': JsonLootConditionDamageSourceProperties,
  'minecraft:damage_source_properties': JsonLootConditionDamageSourceProperties,
  'enchantment_active_check': JsonLootConditionEnchantmentActiveCheck,
  'minecraft:enchantment_active_check': JsonLootConditionEnchantmentActiveCheck,
  'entity_properties': JsonLootConditionEntityProperties,
  'minecraft:entity_properties': JsonLootConditionEntityProperties,
  'entity_scores': JsonLootConditionEntityScores,
  'minecraft:entity_scores': JsonLootConditionEntityScores,
  'environment_attribute_check': JsonLootConditionEnvironmentAttributeCheck,
  'minecraft:environment_attribute_check': JsonLootConditionEnvironmentAttributeCheck,
  'inverted': JsonLootConditionInverted,
  'minecraft:inverted': JsonLootConditionInverted,
  'killed_by_player': JsonLootConditionKilledByPlayer,
  'minecraft:killed_by_player': JsonLootConditionKilledByPlayer,
  'location_check': JsonLootConditionLocationCheck,
  'minecraft:location_check': JsonLootConditionLocationCheck,
  'match_block': JsonLootConditionMatchBlock,
  'minecraft:match_block': JsonLootConditionMatchBlock,
  'match_tool': JsonLootConditionMatchTool,
  'minecraft:match_tool': JsonLootConditionMatchTool,
  'random_chance': JsonLootConditionRandomChance,
  'minecraft:random_chance': JsonLootConditionRandomChance,
  'random_chance_with_enchanted_bonus': JsonLootConditionRandomChanceWithEnchantedBonus,
  'minecraft:random_chance_with_enchanted_bonus': JsonLootConditionRandomChanceWithEnchantedBonus,
  'table_bonus': JsonLootConditionTableBonus,
  'minecraft:table_bonus': JsonLootConditionTableBonus,
  'time_check': JsonLootConditionTimeCheck,
  'minecraft:time_check': JsonLootConditionTimeCheck,
  'value_check': JsonLootConditionValueCheck,
  'minecraft:value_check': JsonLootConditionValueCheck,
  'weather_check': JsonLootConditionWeatherCheck,
  'minecraft:weather_check': JsonLootConditionWeatherCheck,
}
type JsonLootConditionKeys = keyof JsonLootConditionDispatcherMap
type JsonLootConditionFallback = (
  | JsonLootConditionAllOf
  | JsonLootConditionAnyOf
  | JsonLootConditionDamageSourceProperties
  | JsonLootConditionEnchantmentActiveCheck
  | JsonLootConditionEntityProperties
  | JsonLootConditionEntityScores
  | JsonLootConditionEnvironmentAttributeCheck
  | JsonLootConditionInverted
  | JsonLootConditionKilledByPlayer
  | JsonLootConditionLocationCheck
  | JsonLootConditionMatchBlock
  | JsonLootConditionMatchTool
  | JsonLootConditionRandomChance
  | JsonLootConditionRandomChanceWithEnchantedBonus
  | JsonLootConditionTableBonus
  | JsonLootConditionTimeCheck
  | JsonLootConditionValueCheck
  | JsonLootConditionWeatherCheck)
type JsonLootConditionAllOf = JsonAllOf
type JsonLootConditionAnyOf = JsonAnyOf
type JsonLootConditionDamageSourceProperties = JsonDamageSourceProperties
type JsonLootConditionEnchantmentActiveCheck = JsonEnchantmentActiveCheck
type JsonLootConditionEntityProperties = JsonEntityProperties
type JsonLootConditionEntityScores = JsonEntityScores
type JsonLootConditionEnvironmentAttributeCheck = JsonEnvironmentAttributeCheck
type JsonLootConditionInverted = JsonInverted
type JsonLootConditionKilledByPlayer = JsonKilledByPlayer
type JsonLootConditionLocationCheck = JsonLocationCheck
type JsonLootConditionMatchBlock = JsonBlockPredicate
type JsonLootConditionMatchTool = JsonMatchTool
type JsonLootConditionRandomChance = JsonRandomChance
type JsonLootConditionRandomChanceWithEnchantedBonus = JsonRandomChanceWithEnchantedBonus
type JsonLootConditionTableBonus = JsonTableBonus
type JsonLootConditionTimeCheck = JsonTimeCheck
type JsonLootConditionValueCheck = JsonValueCheck
type JsonLootConditionWeatherCheck = JsonWeatherCheck
export type JsonSymbolLootCondition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonLootConditionDispatcherMap
  : CASE extends 'keys' ? JsonLootConditionKeys : CASE extends '%fallback' ? JsonLootConditionFallback : never
