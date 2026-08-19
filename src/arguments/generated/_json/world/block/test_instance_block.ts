import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRotation } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTIntArray, TestInstanceClass } from 'sandstone'

export type JsonErrorMarker = {
  /**
   * Value:
   * Array length range: 3
   */
  pos: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  text: JsonText,
}

export type JsonTestInstanceBlock = (JsonBlockEntity & {
  data?: {
    test?: (JsonRegistry['minecraft:test_instance'] | TestInstanceClass),
    /**
     * Value:
     * Array length range: 3
     */
    size: NBTIntArray<{
      leftExclusive: false,
      rightExclusive: false,
      min: 3,
      max: 3,
    }>,
    /**
     * Value:
     *
     *  - None(`none`)
     *  - Clockwise90(`clockwise_90`)
     *  - Clockwise180(`180`)
     *  - CounterClockwise90(`counterclockwise_90`)
     */
    rotation: JsonRotation,
    ignore_entities: boolean,
    /**
     * Value:
     *
     *  - Cleared(`cleared`)
     *  - Running(`running`)
     *  - Finished(`finished`)
     */
    status: JsonTestInstanceBlockStatus,
    error_message?: JsonText,
  },
  errors?: Array<{
    /**
     * Value:
     * Array length range: 3
     */
    pos: NBTIntArray<{
      leftExclusive: false,
      rightExclusive: false,
      min: 3,
      max: 3,
    }>,
    text: JsonText,
  }>,
})

export type JsonTestInstanceBlockData = {
  test?: (JsonRegistry['minecraft:test_instance'] | TestInstanceClass),
  /**
   * Value:
   * Array length range: 3
   */
  size: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   *
   *  - None(`none`)
   *  - Clockwise90(`clockwise_90`)
   *  - Clockwise180(`180`)
   *  - CounterClockwise90(`counterclockwise_90`)
   */
  rotation: JsonRotation,
  ignore_entities: boolean,
  /**
   * Value:
   *
   *  - Cleared(`cleared`)
   *  - Running(`running`)
   *  - Finished(`finished`)
   */
  status: JsonTestInstanceBlockStatus,
  error_message?: JsonText,
}

export type JsonTestInstanceBlockStatus = ('cleared' | 'running' | 'finished')
