import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonDirectionByte } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTFloat } from 'sandstone'

export type JsonMovingPiston = (JsonBlockEntity & {
  /**
   * Moving block represented by the moving piston.
   */
  blockState?: JsonBlockState,
  /**
   * The direction it is moving.
   *
   * Value:
   *
   *  - Down(`0`)
   *  - Up(`1`)
   *  - North(`2`)
   *  - South(`3`)
   *  - West(`4`)
   *  - East(`5`)
   */
  facing?: JsonDirectionByte,
  /**
   * How far it has moved.
   */
  progress?: (NBTFloat | number),
  extending?: boolean,
  /**
   * Whether the moving piston is the piston head.
   */
  source?: boolean,
})
