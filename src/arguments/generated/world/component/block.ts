import type { Registry } from 'sandstone/generated/registry'
import type { AnyEntity } from 'sandstone/generated/world/entity'
import type { ItemStack } from 'sandstone/generated/world/item'
import type { NBTInt, NBTLong } from 'sandstone'

export type ContainerLoot = {
    loot_table: Registry['minecraft:loot_table']
    seed?: NBTLong
}

export type ContainerSlot = {
    /**
     * The slot ID of the container.
     *
     * Value:
     * Range: 0..255
     */
    slot: NBTInt<{
        min: 0
    }>
    /**
     * The item stack in this container slot.
     */
    item: ItemStack
}

export type Occupant = {
    entity_data: AnyEntity
    min_ticks_in_hive: NBTInt
    ticks_in_hive: NBTInt
}
