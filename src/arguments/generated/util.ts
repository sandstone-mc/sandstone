import type { Registry } from 'sandstone/generated/registry'
import type { NBTInt, NBTIntArray, NBTList } from 'sandstone'

export type Filterable<T> = ({
    raw: T
    /**
     * Shown only to players with chat filtering enabled.
     */
    filtered?: T
} | T)

export type GlobalPos = {
    /**
     * Coordinates of the location in [x, y, z]
     *
     * Value:
     * Array length range: 3
     */
    pos: NBTIntArray<{
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    /**
     * Dimension of the location
     */
    dimension: Registry['minecraft:dimension']
}

export type InclusiveRange<T> = (T | NBTList<T, {
    leftExclusive: false
    rightExclusive: false
    min: 2
    max: 2
}> | {
    min_inclusive: T
    max_inclusive: T
})

export type NonEmptyWeightedList<T> = NBTList<WeightedEntry<T>, {
    leftExclusive: false
    min: 1
}>

export type WeightedEntry<T> = {
    /**
     * Value:
     * Range: 0..
     */
    weight: NBTInt<{
        min: 0
    }>
    data: T
}

export type WeightedList<T> = Array<WeightedEntry<T>>
