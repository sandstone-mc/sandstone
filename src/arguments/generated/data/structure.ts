import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.js'
import type { AnyEntity } from 'sandstone/arguments/generated/world/entity.js'
import type { NBTDouble, NBTInt, NBTList } from 'sandstone'

export type BlockPalette = ({
  palette: Array<BlockState>
} | {
  /**
     * Sets of different block states used in the structure, a random palette gets selected based on coordinates.
     */
  palettes: Array<Array<BlockState>>
})

export type StructureNBT = ({
  /**
     * [Data version](https://minecraft.wiki/w/Data_version).
     *
     * Value:
     * Range: 0..
     */
  DataVersion: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     * List length range: 3
     */
  size: NBTList<NBTInt<{
    min: 0
  }>, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  blocks: Array<{
    /**
         * Value:
         * Range: 0..
         */
    state: NBTInt<{
      min: 0
    }>
    /**
         * Value:
         * List length range: 3
         */
    pos: NBTList<NBTInt<{
      min: 0
    }>, {
      leftExclusive: false
      rightExclusive: false
      min: 3
      max: 3
    }>
    nbt?: Dispatcher<'minecraft:block', [
      '%fallback',
    ]>
  }>
  entities: Array<{
    /**
         * Value:
         * List length range: 3
         */
    pos: NBTList<(NBTDouble<{
      leftExclusive: false
      min: 0
    }> | number), {
      leftExclusive: false
      rightExclusive: false
      min: 3
      max: 3
    }>
    /**
         * Value:
         * List length range: 3
         */
    blockPos: NBTList<NBTInt<{
      min: 0
    }>, {
      leftExclusive: false
      rightExclusive: false
      min: 3
      max: 3
    }>
    nbt: AnyEntity
  }>
} & BlockPalette)
