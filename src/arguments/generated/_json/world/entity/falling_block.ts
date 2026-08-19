import type { JsonSymbolBlock } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { NBTFloat, NBTInt } from 'sandstone'

export type JsonFallingBlock<S = undefined> = NonNullable<({
  [S in Extract<Extract<JsonBlockState, string>, string>]?: (JsonEntityBase & {
    /**
     * NBT data for the placed block.
     */
    TileEntityData?: ((S extends keyof JsonSymbolBlock
      ? JsonSymbolBlock[S]
      : JsonSymbolBlock<'%unknown'>) & (S extends keyof JsonSymbolBlock
        ? JsonSymbolBlock[S]
        : JsonSymbolBlock<'%unknown'>)),
    /**
     * Block state for the placed block. Defaults to sand.
     */
    BlockState?: S,
    /**
     * Ticks it has existed.
     */
    Time?: (NBTInt | number),
    /**
     * Whether it should drop as a block when destroyed.
     */
    DropItem?: boolean,
    /**
     * Whether this it should hurt entities.
     */
    HurtEntities?: boolean,
    /**
     * Maximum damage it should deal.
     */
    FallHurtMax?: (NBTInt | number),
    /**
     * Damage multiplier.
     */
    FallHurtAmount?: (NBTFloat | number),
    /**
     * Whether the block should be destroyed instead of placed after landing on a solid block.
     * When `true`, the block is not dropped as an item, even if the DropItem tag is set to `true`.
     * However, if the entity is deleted due to its Time value being too high, this tag is ignored and an item is dropped depending on the `DropItem` tag.
     * Defaults to `1` for falling suspicious sand and suspicious gravel, and `0` for the other vanilla falling blocks and any summoned falling block.
     */
    CancelDrop?: boolean,
  })
}[Extract<JsonBlockState, string>])>
