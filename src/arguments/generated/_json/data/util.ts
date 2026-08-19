import type { JsonBlockEntityTarget, JsonEntityTarget } from 'sandstone/arguments/generated/_json/data/loot.ts'
import type { JsonNumberProviderRef } from 'sandstone/arguments/generated/_json/data/number_provider.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNBTObject, JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { SingleEntityArgument } from 'sandstone/arguments'
import type { NamespacedString, NBTFloat, NBTInt, NonEmptyString } from 'sandstone'

export type JsonBinomialIntGenerator = {
  /**
   * Value:
   * Range: 0..
   */
  n: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  p: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonConstantIntGenerator = {
  value: (NBTInt | number),
}

export type JsonContextNbtProvider = {
  target: JsonNbtContextTarget,
}

export type JsonContextScoreProvider = {
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
  target: JsonEntityTarget,
}

export type JsonFixedScoreProvider = {
  name: NonEmptyString | SingleEntityArgument,
}

export type JsonIntLimiter = {
  min?: (NBTInt | number),
  max?: (NBTInt | number),
}

export type JsonIntRange = ((NBTInt | number) | {
  /**
   * Clamps to an integer.
   */
  min?: JsonNumberProviderRef,
  /**
   * Clamps to an integer.
   */
  max?: JsonNumberProviderRef,
})

export type JsonMinMaxBounds<T extends JsonNBTObject> = (T | {
  min?: T,
  max?: T,
})

export type JsonMoonPhase = (
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
export type JsonNbtContextTarget = (JsonEntityTarget | JsonBlockEntityTarget)

export type JsonNbtProvider = (JsonNbtContextTarget | ({
  [S in Extract<Extract<JsonRegistry['minecraft:loot_nbt_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolNbtProvider ? JsonSymbolNbtProvider[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:loot_nbt_provider_type'], string>]))

export type JsonNbtProviderSource = (
  | 'this'
  | 'killer'
  | 'attacker'
  | 'direct_killer'
  | 'direct_attacker'
  | 'killer_player'
  | 'attacking_player'
  | 'block_entity')

export type JsonRandomIntGenerator = ((NBTInt | number) | ({
  [S in Extract<Extract<JsonRandomIntGeneratorType, string>, string>]?: ({
    /**
     * Value:
     *
     *  - Uniform(`uniform`)
     *  - Binomial(`binomial`)
     *  - Constant(`constant`)
     */
    type?: S,
  } & (S extends undefined
    ? JsonSymbolRandomIntGenerator<'%none'> :
    (S extends keyof JsonSymbolRandomIntGenerator ? JsonSymbolRandomIntGenerator[S] : JsonRootNBT)))
}[Extract<JsonRandomIntGeneratorType, string>]))

export type JsonRandomIntGeneratorType = ('uniform' | 'binomial' | 'constant')

export type JsonRandomValueBounds = ((NBTFloat | number) | {
  min: (NBTFloat | number),
  max: (NBTFloat | number),
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
export type JsonScoreProvider = (JsonEntityTarget | ({
  [S in Extract<Extract<JsonRegistry['minecraft:loot_score_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolScoreProvider ? JsonSymbolScoreProvider[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:loot_score_provider_type'], string>]))

export type JsonSoundEventRef = (JsonRegistry['minecraft:sound_event'] | {
  sound_id: (NamespacedString | ''),
  /**
   * Range in blocks. If the player is further than this range from the source of the sound, the sound will be inaudible. If omitted, the sound will have a variable range.
   */
  range?: (NBTFloat | number),
})

export type JsonStorageNbtProvider = {
  source: NamespacedString,
}

export type JsonUniformIntGenerator = {
  min?: (NBTInt | number),
  max?: (NBTInt | number),
}

export type JsonWeightedSoundEvent = {
  sound_id: (NamespacedString | ''),
  /**
   * Range in blocks. If the player is further than this range from the source of the sound, the sound will be inaudible. If omitted, the sound will have a variable range.
   */
  range?: (NBTFloat | number),
}
type JsonNbtProviderDispatcherMap = {
  'context': JsonNbtProviderContext,
  'minecraft:context': JsonNbtProviderContext,
  'storage': JsonNbtProviderStorage,
  'minecraft:storage': JsonNbtProviderStorage,
}
type JsonNbtProviderKeys = keyof JsonNbtProviderDispatcherMap
type JsonNbtProviderFallback = (JsonNbtProviderContext | JsonNbtProviderStorage)
type JsonNbtProviderContext = JsonContextNbtProvider
type JsonNbtProviderStorage = JsonStorageNbtProvider
export type JsonSymbolNbtProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonNbtProviderDispatcherMap
  : CASE extends 'keys' ? JsonNbtProviderKeys : CASE extends '%fallback' ? JsonNbtProviderFallback : never
type JsonRandomIntGeneratorDispatcherMap = {
  'binomial': JsonRandomIntGeneratorBinomial,
  'minecraft:binomial': JsonRandomIntGeneratorBinomial,
  'constant': JsonRandomIntGeneratorConstant,
  'minecraft:constant': JsonRandomIntGeneratorConstant,
  'uniform': JsonRandomIntGeneratorUniform,
  'minecraft:uniform': JsonRandomIntGeneratorUniform,
}
type JsonRandomIntGeneratorKeys = keyof JsonRandomIntGeneratorDispatcherMap
type JsonRandomIntGeneratorFallback = (
  | JsonRandomIntGeneratorBinomial
  | JsonRandomIntGeneratorConstant
  | JsonRandomIntGeneratorUniform)
type JsonRandomIntGeneratorNoneType = JsonUniformIntGenerator
type JsonRandomIntGeneratorBinomial = JsonBinomialIntGenerator
type JsonRandomIntGeneratorConstant = JsonConstantIntGenerator
type JsonRandomIntGeneratorUniform = JsonUniformIntGenerator
export type JsonSymbolRandomIntGenerator<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonRandomIntGeneratorDispatcherMap
  : CASE extends 'keys'
    ? JsonRandomIntGeneratorKeys
    : CASE extends '%fallback'
      ? JsonRandomIntGeneratorFallback
      : CASE extends '%none' ? JsonRandomIntGeneratorNoneType : never
type JsonScoreProviderDispatcherMap = {
  'context': JsonScoreProviderContext,
  'minecraft:context': JsonScoreProviderContext,
  'fixed': JsonScoreProviderFixed,
  'minecraft:fixed': JsonScoreProviderFixed,
}
type JsonScoreProviderKeys = keyof JsonScoreProviderDispatcherMap
type JsonScoreProviderFallback = (JsonScoreProviderContext | JsonScoreProviderFixed)
type JsonScoreProviderContext = JsonContextScoreProvider
type JsonScoreProviderFixed = JsonFixedScoreProvider
export type JsonSymbolScoreProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonScoreProviderDispatcherMap
  : CASE extends 'keys' ? JsonScoreProviderKeys : CASE extends '%fallback' ? JsonScoreProviderFallback : never
