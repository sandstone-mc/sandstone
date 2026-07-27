import type { AgeableMob, MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type HappyGhast = (MobBase & AgeableMob & {
  still_timeout?: NBTInt,
})
