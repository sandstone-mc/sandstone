import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { DirectionByte } from 'sandstone/arguments/generated/util/direction.ts'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTFloat } from 'sandstone'

export type MovingPiston = (BlockEntity & {
  /**
   * Moving block represented by the moving piston.
   */
  blockState?: BlockState,
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
  facing?: DirectionByte,
  /**
   * How far it has moved.
   */
  progress?: NBTFloat,
  extending?: boolean,
  /**
   * Whether the moving piston is the piston head.
   */
  source?: boolean,
})
