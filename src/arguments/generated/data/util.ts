import type { LevelBasedValue } from 'sandstone/arguments/generated/data/enchantment/level_based_value.js'
import type { BlockEntityTarget, EntityTarget } from 'sandstone/arguments/generated/data/loot.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { DataPointClass, NBTFloat, NBTInt, ObjectiveClass, Score } from 'sandstone'

export type BinomialIntGenerator = {
  /**
     * Value:
     * Range: 0..
     */
  n: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     * Range: 0..1
     */
  p: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type BinomialNumberProvider = {
  n: NumberProvider
  p: NumberProvider
}

export type ConstantIntGenerator = {
  value: NBTInt
}

export type ConstantNumberProvider = {
  value: NBTFloat
}

export type ContextNbtProvider = {
  target: NbtContextTarget
}

export type ContextScoreProvider = {
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
  target: EntityTarget
}

export type EnchantmentLevelProvider = {
  amount: LevelBasedValue
}

export type FixedScoreProvider = {
  name: `${any}${string}` | Score
}

export type IntLimiter = {
  min?: NBTInt
  max?: NBTInt
}

export type IntRange = (NBTInt | {
  /**
     * Clamped to an integer.
     */
  min?: NumberProvider
  /**
     * Clamped to an integer.
     */
  max?: NumberProvider
})

export type MinMaxBounds<T> = (T | {
  min?: T
  max?: T
})

export type MoonPhase = (
  | 'full_moon'
  | 'waning_gibbous'
  | 'third_quarter'
  | 'waning_crescent'
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous')

/**
 * *either*
 *
 *
 *
 * *or*
 *
 * *item 1*
 */
export type NbtContextTarget = (EntityTarget | BlockEntityTarget)

export type NbtProvider = (NbtContextTarget | ({
  [S in Extract<Registry['minecraft:loot_nbt_provider_type'], string>]?: ({
    type: S
  } & (S extends keyof Dispatcher<'minecraft:nbt_provider'>
    ? Dispatcher<'minecraft:nbt_provider'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:loot_nbt_provider_type']]))

export type NbtProviderSource = (
  | 'this'
  | 'killer'
  | 'attacker'
  | 'direct_killer'
  | 'direct_attacker'
  | 'killer_player'
  | 'attacking_player'
  | 'block_entity')

export type NumberProvider = (NBTFloat | ({
  [S in Extract<Registry['minecraft:loot_number_provider_type'], string>]?: ({
    type?: S
  } & (S extends undefined ? Dispatcher<'minecraft:number_provider', [
    '%none',
  ]> : (S extends keyof Dispatcher<'minecraft:number_provider'>
    ? Dispatcher<'minecraft:number_provider'>[S]
    : Record<string, unknown>)));
}[Registry['minecraft:loot_number_provider_type']]))

export type RandomIntGenerator = (NBTInt | ({
  [S in Extract<RandomIntGeneratorType, string>]?: ({
    /**
         * Value:
         *
         *  - Uniform(`uniform`)
         *  - Binomial(`binomial`)
         *  - Constant(`constant`)
         */
    type?: S
  } & (S extends undefined ? Dispatcher<'minecraft:random_int_generator', [
    '%none',
  ]> : (S extends keyof Dispatcher<'minecraft:random_int_generator'>
    ? Dispatcher<'minecraft:random_int_generator'>[S]
    : Record<string, unknown>)));
}[RandomIntGeneratorType]))

export type RandomIntGeneratorType = ('uniform' | 'binomial' | 'constant')

export type RandomValueBounds = (NBTFloat | {
  min: NBTFloat
  max: NBTFloat
})

export type ScoreNumberProvider = {
  target: ScoreProvider
  score: `${any}${string}` | ObjectiveClass
  scale?: NBTFloat
}

/**
 * *either*
 *
 *
 *
 * *or*
 *
 * *item 1*
 */
export type ScoreProvider = (EntityTarget | ({
  [S in Extract<Registry['minecraft:loot_score_provider_type'], string>]?: ({
    type: S
  } & (S extends keyof Dispatcher<'minecraft:score_provider'>
    ? Dispatcher<'minecraft:score_provider'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:loot_score_provider_type']]))

export type SoundEventRef = (Registry['minecraft:sound_event'] | {
  sound_id: (`${string}:${string}` | '')
  /**
     * Range in blocks. If the player is further than this range from the source of the sound, the sound will be inaudible. If omitted, the sound will have a variable range.
     */
  range?: NBTFloat
})

export type StorageNbtProvider = {
  source: `${string}:${string}`
}

export type StorageNumberProvider = {
  storage: `${string}:${string}`
  path: `${any}${string}` | DataPointClass
}

export type SumNumberProvider = {
  summands: Array<NumberProvider>
}

export type UniformIntGenerator = {
  min?: NBTInt
  max?: NBTInt
}

export type UniformNumberProvider = {
  min?: NumberProvider
  max?: NumberProvider
}
type NbtProviderDispatcherMap = {
  'context': NbtProviderContext
  'minecraft:context': NbtProviderContext
  'storage': NbtProviderStorage
  'minecraft:storage': NbtProviderStorage
}
type NbtProviderKeys = keyof NbtProviderDispatcherMap
type NbtProviderFallback = (NbtProviderContext | NbtProviderStorage)
type NbtProviderContext = ContextNbtProvider
type NbtProviderStorage = StorageNbtProvider
export type SymbolNbtProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? NbtProviderDispatcherMap
  : CASE extends 'keys' ? NbtProviderKeys : CASE extends '%fallback' ? NbtProviderFallback : never
type NumberProviderDispatcherMap = {
  'binomial': NumberProviderBinomial
  'minecraft:binomial': NumberProviderBinomial
  'constant': NumberProviderConstant
  'minecraft:constant': NumberProviderConstant
  'enchantment_level': NumberProviderEnchantmentLevel
  'minecraft:enchantment_level': NumberProviderEnchantmentLevel
  'score': NumberProviderScore
  'minecraft:score': NumberProviderScore
  'storage': NumberProviderStorage
  'minecraft:storage': NumberProviderStorage
  'sum': NumberProviderSum
  'minecraft:sum': NumberProviderSum
  'uniform': NumberProviderUniform
  'minecraft:uniform': NumberProviderUniform
}
type NumberProviderKeys = keyof NumberProviderDispatcherMap
type NumberProviderFallback = (
  | NumberProviderBinomial
  | NumberProviderConstant
  | NumberProviderEnchantmentLevel
  | NumberProviderScore
  | NumberProviderStorage
  | NumberProviderSum
  | NumberProviderUniform)
type NumberProviderNoneType = UniformNumberProvider
type NumberProviderBinomial = BinomialNumberProvider
type NumberProviderConstant = ConstantNumberProvider
type NumberProviderEnchantmentLevel = EnchantmentLevelProvider
type NumberProviderScore = ScoreNumberProvider
type NumberProviderStorage = StorageNumberProvider
type NumberProviderSum = SumNumberProvider
type NumberProviderUniform = UniformNumberProvider
export type SymbolNumberProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? NumberProviderDispatcherMap
  : CASE extends 'keys'
    ? NumberProviderKeys
    : CASE extends '%fallback' ? NumberProviderFallback : CASE extends '%none' ? NumberProviderNoneType : never
type RandomIntGeneratorDispatcherMap = {
  'binomial': RandomIntGeneratorBinomial
  'minecraft:binomial': RandomIntGeneratorBinomial
  'constant': RandomIntGeneratorConstant
  'minecraft:constant': RandomIntGeneratorConstant
  'uniform': RandomIntGeneratorUniform
  'minecraft:uniform': RandomIntGeneratorUniform
}
type RandomIntGeneratorKeys = keyof RandomIntGeneratorDispatcherMap
type RandomIntGeneratorFallback = (RandomIntGeneratorBinomial | RandomIntGeneratorConstant | RandomIntGeneratorUniform)
type RandomIntGeneratorNoneType = UniformIntGenerator
type RandomIntGeneratorBinomial = BinomialIntGenerator
type RandomIntGeneratorConstant = ConstantIntGenerator
type RandomIntGeneratorUniform = UniformIntGenerator
export type SymbolRandomIntGenerator<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? RandomIntGeneratorDispatcherMap
  : CASE extends 'keys'
    ? RandomIntGeneratorKeys
    : CASE extends '%fallback'
      ? RandomIntGeneratorFallback
      : CASE extends '%none' ? RandomIntGeneratorNoneType : never
type ScoreProviderDispatcherMap = {
  'context': ScoreProviderContext
  'minecraft:context': ScoreProviderContext
  'fixed': ScoreProviderFixed
  'minecraft:fixed': ScoreProviderFixed
}
type ScoreProviderKeys = keyof ScoreProviderDispatcherMap
type ScoreProviderFallback = (ScoreProviderContext | ScoreProviderFixed)
type ScoreProviderContext = ContextScoreProvider
type ScoreProviderFixed = FixedScoreProvider
export type SymbolScoreProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? ScoreProviderDispatcherMap
  : CASE extends 'keys' ? ScoreProviderKeys : CASE extends '%fallback' ? ScoreProviderFallback : never
