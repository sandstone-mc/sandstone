import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob'

export type Bogged = (MobBase & {
  /**
     * Whether the mushrooms on this bogged have been sheared.
     */
  sheared?: boolean
})
