import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'
import type { NBTInt } from 'sandstone'

export type Tadpole = (MobBase & {
    /**
     * Age of it in ticks. When greater than or equal to 24000, it grows into a frog.
     */
    Age?: NBTInt
    /**
     * If it was released from a bucket.
     */
    FromBucket?: boolean
})
