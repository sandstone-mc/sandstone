import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTInt, NBTIntArray } from 'sandstone'

export type JsonFilterable<T extends JsonNBTObject> = ({
  raw: T,
  /**
   * Shown only to players with chat filtering enabled.
   */
  filtered?: T,
} | T)

export type JsonFlatWeightedEntry<T extends JsonNBTObject> = ({
  /**
   * Value:
   * Range: 0..
   */
  weight: (NBTInt<{
    min: 0,
  }> | number),
} & T)

export type JsonFlatWeightedList<T extends JsonNBTObject> = Array<JsonFlatWeightedEntry<T>>

export type JsonGlobalPos = {
  /**
   * Coordinates of the location in [x, y, z]
   *
   * Value:
   * Array length range: 3
   */
  pos: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Dimension of the location
   */
  dimension: JsonRegistry['minecraft:dimension'],
}

export type JsonInclusiveRange<T extends JsonNBTObject> = (T | JsonNBTList<T, {
  leftExclusive: false,
  rightExclusive: false,
  min: 2,
  max: 2,
}> | {
  min_inclusive: T,
  max_inclusive: T,
})

export type JsonNonEmptyFlatWeightedList<T extends JsonNBTObject> = JsonNBTList<JsonFlatWeightedEntry<T>, {
  leftExclusive: false,
  min: 1,
}>

export type JsonNonEmptyWeightedList<T extends JsonNBTObject> = JsonNBTList<JsonWeightedEntry<T>, {
  leftExclusive: false,
  min: 1,
}>

export type JsonRotation = ('none' | 'clockwise_90' | '180' | 'counterclockwise_90')

export type JsonWeightedEntry<T extends JsonNBTObject> = {
  /**
   * Value:
   * Range: 0..
   */
  weight: (NBTInt<{
    min: 0,
  }> | number),
  data: T,
}

export type JsonWeightedList<T extends JsonNBTObject> = Array<JsonWeightedEntry<T>>
