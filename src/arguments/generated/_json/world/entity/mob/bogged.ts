import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'

export type JsonBogged = (JsonMobBase & {
  /**
   * Whether the mushrooms on this bogged have been sheared.
   */
  sheared?: boolean,
})
