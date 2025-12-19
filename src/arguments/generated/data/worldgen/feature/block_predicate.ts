import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.js'
import type { Direction } from 'sandstone/arguments/generated/util/direction.js'
import type { NBTInt, NBTList, TagClass } from 'sandstone'

export type BlockPredicate = ({
    [S in Extract<Registry['minecraft:block_predicate_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:block_predicate'>
        ? Dispatcher<'minecraft:block_predicate'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:block_predicate_type']])

export type CombiningPredicate = {
    predicates: Array<BlockPredicate>
}

export type HasSturdyFacePredicate = (PredicateOffset & {
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
    direction: Direction
})

export type InsideWorldBoundsPredicate = PredicateOffset

export type MatchingBlocksPredicate = (PredicateOffset & {
    blocks: (
        | Array<Registry['minecraft:block']> | (
        Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>))
})

export type MatchingBlockTagPredicate = (PredicateOffset & {
    tag: (Registry['minecraft:tag/block'])
})

export type MatchingFluidsPredicate = (PredicateOffset & {
    fluids: (
        | Array<Registry['minecraft:fluid']> | (
        Registry['minecraft:fluid'] | `#${Registry['minecraft:tag/fluid']}` | TagClass<'fluid'>))
})

export type NotPredicate = {
    predicate: BlockPredicate
}

export type PredicateOffset = {
    /**
     * The block offset to check.
     *
     * Value:
     * List length range: 3
     */
    offset?: NBTList<NBTInt<{
        min: -16
        max: 16
    }>, {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
}

export type UnobstructedPredicate = {
    /**
     * Value:
     * List length range: 3
     */
    offset?: NBTList<NBTInt, {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
}

export type WouldSurvivePredicate = (PredicateOffset & {
    state: BlockState
})
type BlockPredicateDispatcherMap = {
    'all_of': BlockPredicateAllOf
    'minecraft:all_of': BlockPredicateAllOf
    'any_of': BlockPredicateAnyOf
    'minecraft:any_of': BlockPredicateAnyOf
    'has_sturdy_face': BlockPredicateHasSturdyFace
    'minecraft:has_sturdy_face': BlockPredicateHasSturdyFace
    'inside_world_bounds': BlockPredicateInsideWorldBounds
    'minecraft:inside_world_bounds': BlockPredicateInsideWorldBounds
    'matching_block_tag': BlockPredicateMatchingBlockTag
    'minecraft:matching_block_tag': BlockPredicateMatchingBlockTag
    'matching_blocks': BlockPredicateMatchingBlocks
    'minecraft:matching_blocks': BlockPredicateMatchingBlocks
    'matching_fluids': BlockPredicateMatchingFluids
    'minecraft:matching_fluids': BlockPredicateMatchingFluids
    'not': BlockPredicateNot
    'minecraft:not': BlockPredicateNot
    'unobstructed': BlockPredicateUnobstructed
    'minecraft:unobstructed': BlockPredicateUnobstructed
    'would_survive': BlockPredicateWouldSurvive
    'minecraft:would_survive': BlockPredicateWouldSurvive
}
type BlockPredicateKeys = keyof BlockPredicateDispatcherMap
type BlockPredicateFallback = (
    | BlockPredicateAllOf
    | BlockPredicateAnyOf
    | BlockPredicateHasSturdyFace
    | BlockPredicateInsideWorldBounds
    | BlockPredicateMatchingBlockTag
    | BlockPredicateMatchingBlocks
    | BlockPredicateMatchingFluids
    | BlockPredicateNot
    | BlockPredicateUnobstructed
    | BlockPredicateWouldSurvive)
type BlockPredicateAllOf = CombiningPredicate
type BlockPredicateAnyOf = CombiningPredicate
type BlockPredicateHasSturdyFace = HasSturdyFacePredicate
type BlockPredicateInsideWorldBounds = InsideWorldBoundsPredicate
type BlockPredicateMatchingBlockTag = MatchingBlockTagPredicate
type BlockPredicateMatchingBlocks = MatchingBlocksPredicate
type BlockPredicateMatchingFluids = MatchingFluidsPredicate
type BlockPredicateNot = NotPredicate
type BlockPredicateUnobstructed = UnobstructedPredicate
type BlockPredicateWouldSurvive = WouldSurvivePredicate
export type SymbolBlockPredicate<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? BlockPredicateDispatcherMap
    : CASE extends 'keys' ? BlockPredicateKeys : CASE extends '%fallback' ? BlockPredicateFallback : never
