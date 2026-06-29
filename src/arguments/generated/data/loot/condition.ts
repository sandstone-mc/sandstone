import type {
  DamageSourcePredicate,
  EntityPredicate,
  ItemPredicate,
  LocationPredicate,
} from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type { LevelBasedValue } from 'sandstone/arguments/generated/data/enchantment/level_based_value.ts'
import type { EntityTarget, LootCondition } from 'sandstone/arguments/generated/data/loot.ts'
import type { IntRange, NumberProvider } from 'sandstone/arguments/generated/data/util.ts'
import type { SymbolEnvironmentAttribute, SymbolMcdocBlockStates } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NBTObject, RootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  EnchantmentClass,
  NBTFloat,
  NBTInt,
  NBTLong,
  ObjectiveClass,
  PredicateClass,
  WorldClockClass,
} from 'sandstone'

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
  [S in Extract<Registry['minecraft:environment_attribute'], string>]?: {
    attribute: S,
    value: (S extends keyof SymbolEnvironmentAttribute
      ? SymbolEnvironmentAttribute[S]
      : SymbolEnvironmentAttribute<'%unknown'>),
  }
}[Registry['minecraft:environment_attribute']])>

export type KilledByPlayer = {
  inverse?: boolean,
}

export type LocationCheck = {
  offsetX?: NBTInt,
  offsetY?: NBTInt,
  offsetZ?: NBTInt,
  predicate: LocationPredicate,
}

// TODO: Make this actually work properly
export type LootConditionOf<C extends NBTObject> = Array<LootCondition>

export type MatchTool = {
  predicate: ItemPredicate,
}

export type RandomChance = {
  /**
   * Clamps to a float between `0` & `1` (inclusive).
   */
  chance: NumberProvider,
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
  name: (`${string}:${string}` | PredicateClass),
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
  value: NumberProvider,
  /**
   * Passes when `value` is within this range.
   */
  range: IntRange,
}

export type WeatherCheck = {
  raining?: boolean,
  thundering?: boolean,
}
type LootConditionDispatcherMap<C extends NBTObject> = {
  'all_of': LootConditionAllOf<C>,
  'minecraft:all_of': LootConditionAllOf<C>,
  'alternative': LootConditionAlternative<C>,
  'minecraft:alternative': LootConditionAlternative<C>,
  'any_of': LootConditionAnyOf<C>,
  'minecraft:any_of': LootConditionAnyOf<C>,
  'block_state_property': LootConditionBlockStateProperty<C>,
  'minecraft:block_state_property': LootConditionBlockStateProperty<C>,
  'damage_source_properties': LootConditionDamageSourceProperties<C>,
  'minecraft:damage_source_properties': LootConditionDamageSourceProperties<C>,
  'enchantment_active_check': LootConditionEnchantmentActiveCheck<C>,
  'minecraft:enchantment_active_check': LootConditionEnchantmentActiveCheck<C>,
  'entity_properties': LootConditionEntityProperties<C>,
  'minecraft:entity_properties': LootConditionEntityProperties<C>,
  'entity_scores': LootConditionEntityScores<C>,
  'minecraft:entity_scores': LootConditionEntityScores<C>,
  'environment_attribute_check': LootConditionEnvironmentAttributeCheck<C>,
  'minecraft:environment_attribute_check': LootConditionEnvironmentAttributeCheck<C>,
  'inverted': LootConditionInverted<C>,
  'minecraft:inverted': LootConditionInverted<C>,
  'killed_by_player': LootConditionKilledByPlayer<C>,
  'minecraft:killed_by_player': LootConditionKilledByPlayer<C>,
  'location_check': LootConditionLocationCheck<C>,
  'minecraft:location_check': LootConditionLocationCheck<C>,
  'match_tool': LootConditionMatchTool<C>,
  'minecraft:match_tool': LootConditionMatchTool<C>,
  'random_chance': LootConditionRandomChance<C>,
  'minecraft:random_chance': LootConditionRandomChance<C>,
  'random_chance_with_enchanted_bonus': LootConditionRandomChanceWithEnchantedBonus<C>,
  'minecraft:random_chance_with_enchanted_bonus': LootConditionRandomChanceWithEnchantedBonus<C>,
  'random_chance_with_looting': LootConditionRandomChanceWithLooting<C>,
  'minecraft:random_chance_with_looting': LootConditionRandomChanceWithLooting<C>,
  'reference': LootConditionReference<C>,
  'minecraft:reference': LootConditionReference<C>,
  'table_bonus': LootConditionTableBonus<C>,
  'minecraft:table_bonus': LootConditionTableBonus<C>,
  'time_check': LootConditionTimeCheck<C>,
  'minecraft:time_check': LootConditionTimeCheck<C>,
  'value_check': LootConditionValueCheck<C>,
  'minecraft:value_check': LootConditionValueCheck<C>,
  'weather_check': LootConditionWeatherCheck<C>,
  'minecraft:weather_check': LootConditionWeatherCheck<C>,
}
type LootConditionKeys = keyof LootConditionDispatcherMap<NBTObject>
type LootConditionFallback<C extends NBTObject> = (
  | LootConditionAllOf<C>
  | LootConditionAlternative<C>
  | LootConditionAnyOf<C>
  | LootConditionBlockStateProperty<C>
  | LootConditionDamageSourceProperties<C>
  | LootConditionEnchantmentActiveCheck<C>
  | LootConditionEntityProperties<C>
  | LootConditionEntityScores<C>
  | LootConditionEnvironmentAttributeCheck<C>
  | LootConditionInverted<C>
  | LootConditionKilledByPlayer<C>
  | LootConditionLocationCheck<C>
  | LootConditionMatchTool<C>
  | LootConditionRandomChance<C>
  | LootConditionRandomChanceWithEnchantedBonus<C>
  | LootConditionRandomChanceWithLooting<C>
  | LootConditionReference<C>
  | LootConditionTableBonus<C>
  | LootConditionTimeCheck<C>
  | LootConditionValueCheck<C>
  | LootConditionWeatherCheck<C>)
export type LootConditionAllOf<C extends NBTObject> = {
  /**
   * Passes when all of these conditions pass.
   */
  terms: Array<LootConditionOf<C>>,
}

export type LootConditionAlternative<C extends NBTObject> = {
  terms: Array<LootConditionOf<C>>,
}

export type LootConditionAnyOf<C extends NBTObject> = {
  /**
   * Passes when any of these conditions pass.
   */
  terms: Array<LootConditionOf<C>>,
}

export type LootConditionBlockStateProperty<C extends NBTObject> = BlockStateProperty

export type LootConditionDamageSourceProperties<C extends NBTObject> = DamageSourceProperties

export type LootConditionEnchantmentActiveCheck<C extends NBTObject> = EnchantmentActiveCheck

export type LootConditionEntityProperties<C extends NBTObject> = EntityProperties

export type LootConditionEntityScores<C extends NBTObject> = EntityScores

export type LootConditionEnvironmentAttributeCheck<C extends NBTObject> = EnvironmentAttributeCheck

export type LootConditionInverted<C extends NBTObject> = {
  term: LootConditionOf<C>,
}

export type LootConditionKilledByPlayer<C extends NBTObject> = KilledByPlayer

export type LootConditionLocationCheck<C extends NBTObject> = LocationCheck

export type LootConditionMatchTool<C extends NBTObject> = MatchTool

export type LootConditionRandomChance<C extends NBTObject> = RandomChance

export type LootConditionRandomChanceWithEnchantedBonus<C extends NBTObject> = RandomChanceWithEnchantedBonus

export type LootConditionRandomChanceWithLooting<C extends NBTObject> = RandomChanceWithLooting

export type LootConditionReference<C extends NBTObject> = Reference

export type LootConditionTableBonus<C extends NBTObject> = TableBonus

export type LootConditionTimeCheck<C extends NBTObject> = TimeCheck

export type LootConditionValueCheck<C extends NBTObject> = ValueCheck

export type LootConditionWeatherCheck<C extends NBTObject> = WeatherCheck

export type SymbolLootCondition<C extends NBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? LootConditionDispatcherMap<C>
  : CASE extends 'keys' ? LootConditionKeys : CASE extends '%fallback' ? LootConditionFallback<C> : never
