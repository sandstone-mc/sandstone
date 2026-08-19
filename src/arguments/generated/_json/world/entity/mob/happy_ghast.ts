import type { JsonAgeableMob, JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonHappyGhast = (JsonMobBase & JsonAgeableMob & {
  still_timeout?: (NBTInt | number),
})
