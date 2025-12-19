import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.js'
import type { EntityBase } from 'sandstone/arguments/generated/world/entity.js'
import type { NBTFloat, NBTInt } from 'sandstone'

export type FallingBlock<S = undefined> = (EntityBase & {
    /**
     * NBT data for the placed block.
     */
    TileEntityData?: (S extends keyof Dispatcher<'minecraft:block'>
        ? Dispatcher<'minecraft:block'>[S]
        : Record<string, unknown>)
    /**
     * Block state for the placed block. Defaults to sand.
     */
    BlockState?: BlockState
    /**
     * Ticks it has existed.
     */
    Time?: NBTInt
    /**
     * Whether it should drop as a block when destroyed.
     */
    DropItem?: boolean
    /**
     * Whether this it should hurt entities.
     */
    HurtEntities?: boolean
    /**
     * Maximum damage it should deal.
     */
    FallHurtMax?: NBTInt
    /**
     * Damage multiplier.
     */
    FallHurtAmount?: NBTFloat
    /**
     * Whether the block should be destroyed instead of placed after landing on a solid block.
     * When `true`, the block is not dropped as an item, even if the DropItem tag is set to `true`.
     * However, if the entity is deleted due to its Time value being too high, this tag is ignored and an item is dropped depending on the `DropItem` tag.
     * Defaults to `1` for falling suspicious sand and suspicious gravel, and `0` for the other vanilla falling blocks and any summoned falling block.
     */
    CancelDrop?: boolean
})
