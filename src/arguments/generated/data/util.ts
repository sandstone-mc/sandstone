import type { BlockEntityTarget, EntityTarget } from 'sandstone/arguments/generated/data/loot.ts'
import type { NumberProviderRef } from 'sandstone/arguments/generated/data/number_provider.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NBTObject, RootNBT } from 'sandstone/arguments/nbt.ts'
import type { SingleEntityArgument } from 'sandstone/arguments'
import type { NamespacedString, NBTFloat, NBTInt, NBTList, NonEmptyString } from 'sandstone'

export type BinomialIntGenerator = {
  /**
   * Value:
   * Range: 0..
   */
  n: NBTInt<{
    min: 0,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  p: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type ConstantIntGenerator = {
  value: NBTInt,
}

export type ContextNbtProvider = {
  target: NbtContextTarget,
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
  target: EntityTarget,
}

export type FixedScoreProvider = {
  name: NonEmptyString | SingleEntityArgument,
}

export type IntLimiter = {
  min?: NBTInt,
  max?: NBTInt,
}

export type IntRange = (NBTInt | {
  /**
   * Clamps to an integer.
   */
  min?: NumberProviderRef,
  /**
   * Clamps to an integer.
   */
  max?: NumberProviderRef,
})

export type MinMaxBounds<T extends NBTObject> = (T | {
  min?: T,
  max?: T,
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
  [S in Extract<Extract<Registry['minecraft:loot_nbt_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolNbtProvider ? SymbolNbtProvider[S] : RootNBT))
}[Extract<Registry['minecraft:loot_nbt_provider_type'], string>]))

export type NbtProviderSource = (
  | 'this'
  | 'killer'
  | 'attacker'
  | 'direct_killer'
  | 'direct_attacker'
  | 'killer_player'
  | 'attacking_player'
  | 'block_entity')

export type RandomIntGenerator = (NBTInt | ({
  [S in Extract<Extract<RandomIntGeneratorType, string>, string>]?: ({
    /**
     * Value:
     *
     *  - Uniform(`uniform`)
     *  - Binomial(`binomial`)
     *  - Constant(`constant`)
     */
    type?: S,
  } & (S extends undefined
    ? SymbolRandomIntGenerator<'%none'> :
    (S extends keyof SymbolRandomIntGenerator ? SymbolRandomIntGenerator[S] : RootNBT)))
}[Extract<RandomIntGeneratorType, string>]))

export type RandomIntGeneratorType = ('uniform' | 'binomial' | 'constant')

export type RandomValueBounds = (NBTFloat | {
  min: NBTFloat,
  max: NBTFloat,
})

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
  [S in Extract<Extract<Registry['minecraft:loot_score_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolScoreProvider ? SymbolScoreProvider[S] : RootNBT))
}[Extract<Registry['minecraft:loot_score_provider_type'], string>]))

export type SoundEventRef = (Registry['minecraft:sound_event'] | {
  sound_id: (NamespacedString | ''),
  /**
   * Range in blocks. If the player is further than this range from the source of the sound, the sound will be inaudible. If omitted, the sound will have a variable range.
   */
  range?: NBTFloat,
})

export type StorageNbtProvider = {
  source: NamespacedString,
}

export type UniformIntGenerator = {
  min?: NBTInt,
  max?: NBTInt,
}

export type WeightedSoundEvent = {
  sound_id: (NamespacedString | ''),
  /**
   * Range in blocks. If the player is further than this range from the source of the sound, the sound will be inaudible. If omitted, the sound will have a variable range.
   */
  range?: NBTFloat,
}
type NbtProviderDispatcherMap = {
  'context': NbtProviderContext,
  'minecraft:context': NbtProviderContext,
  'storage': NbtProviderStorage,
  'minecraft:storage': NbtProviderStorage,
}
type NbtProviderKeys = keyof NbtProviderDispatcherMap
type NbtProviderFallback = (NbtProviderContext | NbtProviderStorage)
type NbtProviderContext = ContextNbtProvider
type NbtProviderStorage = StorageNbtProvider
export type SymbolNbtProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? NbtProviderDispatcherMap
  : CASE extends 'keys' ? NbtProviderKeys : CASE extends '%fallback' ? NbtProviderFallback : never
type RandomIntGeneratorDispatcherMap = {
  'binomial': RandomIntGeneratorBinomial,
  'minecraft:binomial': RandomIntGeneratorBinomial,
  'constant': RandomIntGeneratorConstant,
  'minecraft:constant': RandomIntGeneratorConstant,
  'uniform': RandomIntGeneratorUniform,
  'minecraft:uniform': RandomIntGeneratorUniform,
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
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? RandomIntGeneratorDispatcherMap
  : CASE extends 'keys'
    ? RandomIntGeneratorKeys
    : CASE extends '%fallback'
      ? RandomIntGeneratorFallback
      : CASE extends '%none' ? RandomIntGeneratorNoneType : never
type ScoreProviderDispatcherMap = {
  'context': ScoreProviderContext,
  'minecraft:context': ScoreProviderContext,
  'fixed': ScoreProviderFixed,
  'minecraft:fixed': ScoreProviderFixed,
}
type ScoreProviderKeys = keyof ScoreProviderDispatcherMap
type ScoreProviderFallback = (ScoreProviderContext | ScoreProviderFixed)
type ScoreProviderContext = ContextScoreProvider
type ScoreProviderFixed = FixedScoreProvider
export type SymbolScoreProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ScoreProviderDispatcherMap
  : CASE extends 'keys' ? ScoreProviderKeys : CASE extends '%fallback' ? ScoreProviderFallback : never
