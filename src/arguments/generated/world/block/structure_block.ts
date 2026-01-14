import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTFloat, NBTInt, NBTLong } from 'sandstone'

export type Mirror = ('NONE' | 'LEFT_RIGHT' | 'FRONT_BACK')

export type Mode = ('SAVE' | 'LOAD' | 'DATA' | 'CORNER')

export type Rotation = ('NONE' | 'CLOCKWISE_90' | 'CLOCKWISE_180' | 'COUNTERCLOCKWISE_90')

export type StructureBlock = (BlockEntity & {
  name?: (Registry['minecraft:structure'] | '')
  /**
   * Author of the structure.
   */
  author?: string
  /**
   * Custom data for the structure. Stores the data id for "DATA" mode.
   */
  metadata?: string
  /**
   * Relative offset.
   */
  posX?: NBTInt
  /**
   * Relative offset.
   */
  posY?: NBTInt
  /**
   * Relative offset.
   */
  posZ?: NBTInt
  sizeX?: NBTInt
  sizeY?: NBTInt
  sizeZ?: NBTInt
  /**
   * Value:
   *
   *  - None(`NONE`)
   *  - Clockwise90(`CLOCKWISE_90`)
   *  - Clockwise180(`CLOCKWISE_180`)
   *  - CounterClockwise90(`COUNTERCLOCKWISE_90`)
   */
  rotation?: Rotation
  /**
   * Value:
   *
   *  - None(`NONE`)
   *  - LeftRight(`LEFT_RIGHT`)
   *  - FrontBack(`FRONT_BACK`)
   */
  mirror?: Mirror
  /**
   * Value:
   *
   *  - Save(`SAVE`)
   *  - Load(`LOAD`)
   *  - Data(`DATA`)
   *  - Corner(`CORNER`)
   */
  mode?: Mode
  ignoreEntities?: boolean
  /**
   * Whether to show the bounding box.
   */
  showboundingbox?: boolean
  /**
   * Whether it has been powered by redstone.
   */
  powered?: boolean
  /**
   * Whether to show invisible blocks inside the bounding box.
   */
  showair?: boolean
  /**
   * If set to `true`, the blocks in the placed structure will trigger block (entity) updates and shape updates. Defaults to `false`.
   */
  strict?: boolean
  /**
   * Chance for each block to stay.
   */
  integrity?: NBTFloat
  /**
   * Seed for the integrity random.
   */
  seed?: NBTLong
})
