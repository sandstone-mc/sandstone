import type { BlockState } from 'sandstone/generated/util/block_state'
import type { MobBase, NeutralMob } from 'sandstone/generated/world/entity/mob'

export type Enderman = (MobBase & NeutralMob & {
    /**
     * Block it is carrying.
     */
    carriedBlockState?: BlockState
})
