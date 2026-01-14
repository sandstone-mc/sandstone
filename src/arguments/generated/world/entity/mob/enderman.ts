import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { MobBase, NeutralMob } from 'sandstone/arguments/generated/world/entity/mob.ts'

export type Enderman = (MobBase & NeutralMob & {
  /**
     * Block it is carrying.
     */
  carriedBlockState?: BlockState
})
