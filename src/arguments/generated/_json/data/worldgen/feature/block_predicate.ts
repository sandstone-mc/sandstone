import type { JsonVerticalAnchor } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NamespacedString, NBTInt, TagClass } from 'sandstone'

export type JsonBlockPredicate = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:block_predicate_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolBlockPredicate ? JsonSymbolBlockPredicate[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:block_predicate_type'], string>])>

export type JsonCombiningPredicate = {
  predicates: Array<JsonBlockPredicate>,
}

export type JsonHasSturdyFacePredicate = (JsonPredicateOffset & {
  /**
   * Value:
   *
   *  - Down(`down`)
   *  - Up(`up`)
   *  - North(`north`)
   *  - East(`east`)
   *  - South(`south`)
   *  - West(`west`)
   */
  direction: JsonDirection,
})

export type JsonHeightRangePredicate = {
  min_inclusive: JsonVerticalAnchor,
  max_inclusive: JsonVerticalAnchor,
}

export type JsonInsideWorldBoundsPredicate = JsonPredicateOffset

export type JsonMatchingBiomesPredicate = {
  biomes: (NamespacedString | Array<NamespacedString>),
}

export type JsonMatchingBlocksPredicate = (JsonPredicateOffset & {
  blocks: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
})

export type JsonMatchingBlockTagPredicate = (JsonPredicateOffset & {
  tag: (JsonRegistry['minecraft:tag/block']),
})

export type JsonMatchingFluidsPredicate = (JsonPredicateOffset & {
  fluids: (
      | Array<JsonRegistry['minecraft:fluid']> | (
      JsonRegistry['minecraft:fluid'] | `#${JsonRegistry['minecraft:tag/fluid']}` | TagClass<'fluid'>)),
})

export type JsonNotPredicate = {
  predicate: JsonBlockPredicate,
}

export type JsonPredicateOffset = {
  /**
   * The block offset to check.
   *
   * Value:
   * List length range: 3
   */
  offset?: JsonNBTList<(NBTInt<{
    min: -16,
    max: 16,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type JsonUnobstructedPredicate = {
  /**
   * Value:
   * List length range: 3
   */
  offset?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type JsonVolumeMatchPredicate = {
  /**
   * Value:
   * List length range: 3
   */
  min: JsonNBTList<(NBTInt<{
    min: -16,
    max: 16,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  max: JsonNBTList<(NBTInt<{
    min: -16,
    max: 16,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  match: JsonBlockPredicate,
}

export type JsonWouldSurvivePredicate = (JsonPredicateOffset & {
  state: JsonBlockState,
})
type JsonBlockPredicateDispatcherMap = {
  'all_of': JsonBlockPredicateAllOf,
  'minecraft:all_of': JsonBlockPredicateAllOf,
  'any_of': JsonBlockPredicateAnyOf,
  'minecraft:any_of': JsonBlockPredicateAnyOf,
  'has_sturdy_face': JsonBlockPredicateHasSturdyFace,
  'minecraft:has_sturdy_face': JsonBlockPredicateHasSturdyFace,
  'height_range': JsonBlockPredicateHeightRange,
  'minecraft:height_range': JsonBlockPredicateHeightRange,
  'inside_world_bounds': JsonBlockPredicateInsideWorldBounds,
  'minecraft:inside_world_bounds': JsonBlockPredicateInsideWorldBounds,
  'matching_biomes': JsonBlockPredicateMatchingBiomes,
  'minecraft:matching_biomes': JsonBlockPredicateMatchingBiomes,
  'matching_block_tag': JsonBlockPredicateMatchingBlockTag,
  'minecraft:matching_block_tag': JsonBlockPredicateMatchingBlockTag,
  'matching_blocks': JsonBlockPredicateMatchingBlocks,
  'minecraft:matching_blocks': JsonBlockPredicateMatchingBlocks,
  'matching_fluids': JsonBlockPredicateMatchingFluids,
  'minecraft:matching_fluids': JsonBlockPredicateMatchingFluids,
  'not': JsonBlockPredicateNot,
  'minecraft:not': JsonBlockPredicateNot,
  'unobstructed': JsonBlockPredicateUnobstructed,
  'minecraft:unobstructed': JsonBlockPredicateUnobstructed,
  'volume_match': JsonBlockPredicateVolumeMatch,
  'minecraft:volume_match': JsonBlockPredicateVolumeMatch,
  'would_survive': JsonBlockPredicateWouldSurvive,
  'minecraft:would_survive': JsonBlockPredicateWouldSurvive,
}
type JsonBlockPredicateKeys = keyof JsonBlockPredicateDispatcherMap
type JsonBlockPredicateFallback = (
  | JsonBlockPredicateAllOf
  | JsonBlockPredicateAnyOf
  | JsonBlockPredicateHasSturdyFace
  | JsonBlockPredicateHeightRange
  | JsonBlockPredicateInsideWorldBounds
  | JsonBlockPredicateMatchingBiomes
  | JsonBlockPredicateMatchingBlockTag
  | JsonBlockPredicateMatchingBlocks
  | JsonBlockPredicateMatchingFluids
  | JsonBlockPredicateNot
  | JsonBlockPredicateUnobstructed
  | JsonBlockPredicateVolumeMatch
  | JsonBlockPredicateWouldSurvive)
type JsonBlockPredicateAllOf = JsonCombiningPredicate
type JsonBlockPredicateAnyOf = JsonCombiningPredicate
type JsonBlockPredicateHasSturdyFace = JsonHasSturdyFacePredicate
type JsonBlockPredicateHeightRange = JsonHeightRangePredicate
type JsonBlockPredicateInsideWorldBounds = JsonInsideWorldBoundsPredicate
type JsonBlockPredicateMatchingBiomes = JsonMatchingBiomesPredicate
type JsonBlockPredicateMatchingBlockTag = JsonMatchingBlockTagPredicate
type JsonBlockPredicateMatchingBlocks = JsonMatchingBlocksPredicate
type JsonBlockPredicateMatchingFluids = JsonMatchingFluidsPredicate
type JsonBlockPredicateNot = JsonNotPredicate
type JsonBlockPredicateUnobstructed = JsonUnobstructedPredicate
type JsonBlockPredicateVolumeMatch = JsonVolumeMatchPredicate
type JsonBlockPredicateWouldSurvive = JsonWouldSurvivePredicate
export type JsonSymbolBlockPredicate<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonBlockPredicateDispatcherMap
  : CASE extends 'keys' ? JsonBlockPredicateKeys : CASE extends '%fallback' ? JsonBlockPredicateFallback : never
