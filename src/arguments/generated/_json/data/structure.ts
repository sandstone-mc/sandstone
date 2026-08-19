import type { JsonSymbolBlock } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonAnyEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonNBTList, NBTDouble, NBTInt } from 'sandstone'

export type JsonBlockPalette = ({
  palette: Array<JsonBlockState>,
} | {
  /**
   * Sets of different block states used in the structure, a random palette gets selected based on coordinates.
   */
  palettes: Array<Array<JsonBlockState>>,
})

export type JsonPalette = {
  palette: Array<JsonBlockState>,
}

export type JsonRandomizedPalette = {
  /**
   * Sets of different block states used in the structure, a random palette gets selected based on coordinates.
   */
  palettes: Array<Array<JsonBlockState>>,
}

export type JsonStructureBlock = {
  /**
   * Value:
   * Range: 0..
   */
  state: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * List length range: 3
   */
  pos: JsonNBTList<(NBTInt<{
    min: 0,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  nbt?: JsonSymbolBlock<'%fallback'>,
}

export type JsonStructureEntity = {
  /**
   * Value:
   * List length range: 3
   */
  pos: JsonNBTList<(NBTDouble<{
    leftExclusive: false,
    min: 0,
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
  blockPos: JsonNBTList<(NBTInt<{
    min: 0,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  nbt: JsonAnyEntity,
}

export type JsonStructureNBT = ({
  /**
   * [Data version](https://minecraft.wiki/w/Data_version).
   *
   * Value:
   * Range: 0..
   */
  DataVersion: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * List length range: 3
   */
  size: JsonNBTList<(NBTInt<{
    min: 0,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  blocks: Array<{
    /**
     * Value:
     * Range: 0..
     */
    state: (NBTInt<{
      min: 0,
    }> | number),
    /**
     * Value:
     * List length range: 3
     */
    pos: JsonNBTList<(NBTInt<{
      min: 0,
    }> | number), {
      leftExclusive: false,
      rightExclusive: false,
      min: 3,
      max: 3,
    }>,
    nbt?: JsonSymbolBlock<'%fallback'>,
  }>,
  entities: Array<{
    /**
     * Value:
     * List length range: 3
     */
    pos: JsonNBTList<(NBTDouble<{
      leftExclusive: false,
      min: 0,
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
    blockPos: JsonNBTList<(NBTInt<{
      min: 0,
    }> | number), {
      leftExclusive: false,
      rightExclusive: false,
      min: 3,
      max: 3,
    }>,
    nbt: JsonAnyEntity,
  }>,
} & JsonBlockPalette)
