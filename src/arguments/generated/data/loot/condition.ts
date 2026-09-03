import type {
  BlockPredicate,
  DamageSourcePredicate,
  EntityPredicate,
  ItemPredicate,
  LocationPredicate,
} from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type { LevelBasedValue } from 'sandstone/arguments/generated/data/enchantment/level_based_value.ts'
import type { EntityTarget, IntRange } from 'sandstone/arguments/generated/data/loot.ts'
import type { FloatNumberProviderRef } from 'sandstone/arguments/generated/data/number_provider/contextual_float.ts'
import type {
  IntegerNumberProviderRef,
} from 'sandstone/arguments/generated/data/number_provider/contextual_integer.ts'
import type { LegacyNumberProvider } from 'sandstone/arguments/generated/data/number_provider/legacy.ts'
import type { PredicateListRef, PredicateRef } from 'sandstone/arguments/generated/data/predicate.ts'
import type { SymbolEnvironmentAttribute, SymbolMcdocBlockStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  EnchantmentClass,
  NBTFloat,
  NBTInt,
  NBTLong,
  ObjectiveClass,
  PredicateClass,
  WorldClockClass,
} from 'sandstone'

export type AllOf = {
  /**
   * Passes when all of these conditions pass.
   */
  terms: PredicateListRef,
}

export type Alternative = {
  terms: Array<LootCondition>,
}

export type AnyOf = {
  /**
   * Passes when any of these conditions pass.
   */
  terms: PredicateListRef,
}

export type BlockStateProperty = {
  block: Registry['minecraft:block'],
  properties?: SymbolMcdocBlockStates<'%none'>,
}

export type DamageSourceProperties = {
  predicate: DamageSourcePredicate,
}

export type EnchantmentActiveCheck = {
  active: boolean,
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
  entity: EntityTarget,
  predicate: EntityPredicate,
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
  entity: EntityTarget,
  scores: ({
    [Key in Extract<string | ObjectiveClass, string>]?: IntRange
  }),
}

export type EnvironmentAttributeCheck = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:environment_attribute'], string>, string>]?: {
    attribute: S,
    value: (S extends keyof SymbolEnvironmentAttribute
      ? SymbolEnvironmentAttribute[S]
      : SymbolEnvironmentAttribute<'%unknown'>),
  }
}[Extract<Registry['minecraft:environment_attribute'], string>])>

export type FloatValueCheck = {
  value: FloatNumberProviderRef,
  /**
   * Passes when `value` is within the test range.
   */
  test: (FloatNumberProviderRef | {
    min?: FloatNumberProviderRef,
    max?: FloatNumberProviderRef,
  }),
}

export type IntegerValueCheck = {
  value: IntegerNumberProviderRef,
  /**
   * Passes when `value` is within the test range.
   */
  test: IntRange,
}

export type Inverted = {
  term: PredicateRef,
}

export type KilledByPlayer = {
  inverse?: boolean,
}

export type LocationCheck = {
  offsetX?: NBTInt,
  offsetY?: NBTInt,
  offsetZ?: NBTInt,
  predicate: LocationPredicate,
}

export type LootCondition = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:loot_condition_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolLootCondition ? SymbolLootCondition[S] : RootNBT))
}[Extract<Registry['minecraft:loot_condition_type'], string>])>

export type MatchTool = {
  predicate: ItemPredicate,
}

export type RandomChance = {
  /**
   * Accepts a value between `0` & `1` (inclusive).
   */
  chance: FloatNumberProviderRef,
}

export type RandomChanceWithEnchantedBonus = {
  /**
   * Value:
   * Range: 0..1
   */
  unenchanted_chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  enchanted_chance: LevelBasedValue,
  enchantment: (Registry['minecraft:enchantment'] | EnchantmentClass),
}

export type RandomChanceWithLooting = {
  /**
   * Value:
   * Range: 0..1
   */
  chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Looting adjustment to the base success rate. Formula is `chance + (looting_level * looting_multiplier)` .
   */
  looting_multiplier: NBTFloat,
}

export type Reference = {
  /**
   * A cyclic reference causes a parsing failure.
   */
  name: (Registry['minecraft:predicate'] | PredicateClass),
}

export type TableBonus = {
  enchantment: (Registry['minecraft:enchantment'] | EnchantmentClass),
  /**
   * Probabilities for each enchantment level
   */
  chances: Array<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>>,
}

export type TimeCheck = {
  /**
   * The world clock to check.
   */
  clock: (Registry['minecraft:world_clock'] | WorldClockClass),
  /**
   * Check the current game tick.
   */
  value: IntRange,
  /**
   * Game tick supplied to `value` check gets modulo-divided by this.
   * For example, if set to 24000, `value` operates on a time period of days.
   */
  period?: NBTLong,
}

export type ValueCheck = {
  /**
   * Clamps to an integer.
   */
  value: LegacyNumberProvider,
  /**
   * Passes when `value` is within this range.
   */
  range: IntRange,
}

export type WeatherCheck = {
  raining?: boolean,
  thundering?: boolean,
}
type LootConditionDispatcherMap = {
  'all_of': LootConditionAllOf,
  'minecraft:all_of': LootConditionAllOf,
  'any_of': LootConditionAnyOf,
  'minecraft:any_of': LootConditionAnyOf,
  'damage_source_properties': LootConditionDamageSourceProperties,
  'minecraft:damage_source_properties': LootConditionDamageSourceProperties,
  'enchantment_active_check': LootConditionEnchantmentActiveCheck,
  'minecraft:enchantment_active_check': LootConditionEnchantmentActiveCheck,
  'entity_properties': LootConditionEntityProperties,
  'minecraft:entity_properties': LootConditionEntityProperties,
  'entity_scores': LootConditionEntityScores,
  'minecraft:entity_scores': LootConditionEntityScores,
  'environment_attribute_check': LootConditionEnvironmentAttributeCheck,
  'minecraft:environment_attribute_check': LootConditionEnvironmentAttributeCheck,
  'float_value_check': LootConditionFloatValueCheck,
  'minecraft:float_value_check': LootConditionFloatValueCheck,
  'int_value_check': LootConditionIntValueCheck,
  'minecraft:int_value_check': LootConditionIntValueCheck,
  'inverted': LootConditionInverted,
  'minecraft:inverted': LootConditionInverted,
  'killed_by_player': LootConditionKilledByPlayer,
  'minecraft:killed_by_player': LootConditionKilledByPlayer,
  'location_check': LootConditionLocationCheck,
  'minecraft:location_check': LootConditionLocationCheck,
  'match_block': LootConditionMatchBlock,
  'minecraft:match_block': LootConditionMatchBlock,
  'match_tool': LootConditionMatchTool,
  'minecraft:match_tool': LootConditionMatchTool,
  'random_chance': LootConditionRandomChance,
  'minecraft:random_chance': LootConditionRandomChance,
  'random_chance_with_enchanted_bonus': LootConditionRandomChanceWithEnchantedBonus,
  'minecraft:random_chance_with_enchanted_bonus': LootConditionRandomChanceWithEnchantedBonus,
  'table_bonus': LootConditionTableBonus,
  'minecraft:table_bonus': LootConditionTableBonus,
  'time_check': LootConditionTimeCheck,
  'minecraft:time_check': LootConditionTimeCheck,
  'weather_check': LootConditionWeatherCheck,
  'minecraft:weather_check': LootConditionWeatherCheck,
}
type LootConditionKeys = keyof LootConditionDispatcherMap
type LootConditionFallback = (
  | LootConditionAllOf
  | LootConditionAnyOf
  | LootConditionDamageSourceProperties
  | LootConditionEnchantmentActiveCheck
  | LootConditionEntityProperties
  | LootConditionEntityScores
  | LootConditionEnvironmentAttributeCheck
  | LootConditionFloatValueCheck
  | LootConditionIntValueCheck
  | LootConditionInverted
  | LootConditionKilledByPlayer
  | LootConditionLocationCheck
  | LootConditionMatchBlock
  | LootConditionMatchTool
  | LootConditionRandomChance
  | LootConditionRandomChanceWithEnchantedBonus
  | LootConditionTableBonus
  | LootConditionTimeCheck
  | LootConditionWeatherCheck)
type LootConditionAllOf = AllOf
type LootConditionAnyOf = AnyOf
type LootConditionDamageSourceProperties = DamageSourceProperties
type LootConditionEnchantmentActiveCheck = EnchantmentActiveCheck
type LootConditionEntityProperties = EntityProperties
type LootConditionEntityScores = EntityScores
type LootConditionEnvironmentAttributeCheck = EnvironmentAttributeCheck
type LootConditionFloatValueCheck = FloatValueCheck
type LootConditionIntValueCheck = IntegerValueCheck
type LootConditionInverted = Inverted
type LootConditionKilledByPlayer = KilledByPlayer
type LootConditionLocationCheck = LocationCheck
type LootConditionMatchBlock = BlockPredicate
type LootConditionMatchTool = MatchTool
type LootConditionRandomChance = RandomChance
type LootConditionRandomChanceWithEnchantedBonus = RandomChanceWithEnchantedBonus
type LootConditionTableBonus = TableBonus
type LootConditionTimeCheck = TimeCheck
type LootConditionWeatherCheck = WeatherCheck
export type SymbolLootCondition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? LootConditionDispatcherMap
  : CASE extends 'keys' ? LootConditionKeys : CASE extends '%fallback' ? LootConditionFallback : never
