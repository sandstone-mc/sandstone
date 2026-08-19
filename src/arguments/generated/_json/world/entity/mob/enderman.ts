import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonMobBase, JsonNeutralMob } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'

export type JsonEnderman = (JsonMobBase & JsonNeutralMob & {
  /**
   * Block it is carrying.
   */
  carriedBlockState?: JsonBlockState,
})
