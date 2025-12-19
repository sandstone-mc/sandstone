import type { BlockEntity } from 'sandstone/generated/world/block'
import type { AnyEntity } from 'sandstone/generated/world/entity'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type Bee = {
    min_ticks_in_hive: NBTInt
    ticks_in_hive: NBTInt
    entity_data: AnyEntity
}

export type Beehive = (BlockEntity & {
    /**
     * Value:
     * Array length range: 3
     */
    flower_pos?: NBTIntArray<{
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    bees?: Array<Bee>
})

export type FlowerPos = {
    X?: NBTInt
    Y?: NBTInt
    Z?: NBTInt
}

export type LegacyBee = {
    MinOccupationTicks?: NBTInt
    TicksInHive?: NBTInt
    EntityData?: AnyEntity
}
