import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTFloat, NBTInt, NBTLong, StructureClass } from 'sandstone'

export type JsonMirror = ('NONE' | 'LEFT_RIGHT' | 'FRONT_BACK')

export type JsonMode = ('SAVE' | 'LOAD' | 'DATA' | 'CORNER')

export type JsonRotation = ('NONE' | 'CLOCKWISE_90' | 'CLOCKWISE_180' | 'COUNTERCLOCKWISE_90')

export type JsonStructureBlock = (JsonBlockEntity & {
  name?: (JsonRegistry['minecraft:structure'] | '' | StructureClass),
  /**
   * Author of the structure.
   */
  author?: string,
  /**
   * Custom data for the structure. Stores the data id for "DATA" mode.
   */
  metadata?: string,
  /**
   * Relative offset.
   */
  posX?: (NBTInt | number),
  /**
   * Relative offset.
   */
  posY?: (NBTInt | number),
  /**
   * Relative offset.
   */
  posZ?: (NBTInt | number),
  sizeX?: (NBTInt | number),
  sizeY?: (NBTInt | number),
  sizeZ?: (NBTInt | number),
  /**
   * Value:
   *
   *  - None(`NONE`)
   *  - Clockwise90(`CLOCKWISE_90`)
   *  - Clockwise180(`CLOCKWISE_180`)
   *  - CounterClockwise90(`COUNTERCLOCKWISE_90`)
   */
  rotation?: JsonRotation,
  /**
   * Value:
   *
   *  - None(`NONE`)
   *  - LeftRight(`LEFT_RIGHT`)
   *  - FrontBack(`FRONT_BACK`)
   */
  mirror?: JsonMirror,
  /**
   * Value:
   *
   *  - Save(`SAVE`)
   *  - Load(`LOAD`)
   *  - Data(`DATA`)
   *  - Corner(`CORNER`)
   */
  mode?: JsonMode,
  ignoreEntities?: boolean,
  /**
   * Whether to show the bounding box.
   */
  showboundingbox?: boolean,
  /**
   * Whether it has been powered by redstone.
   */
  powered?: boolean,
  /**
   * Whether to show invisible blocks inside the bounding box.
   */
  showair?: boolean,
  /**
   * If set to `true`, the blocks in the placed structure will trigger block (entity) updates and shape updates. Defaults to `false`.
   */
  strict?: boolean,
  /**
   * Chance for each block to stay.
   */
  integrity?: (NBTFloat | number),
  /**
   * Seed for the integrity random.
   */
  seed?: (NBTLong | number),
})
