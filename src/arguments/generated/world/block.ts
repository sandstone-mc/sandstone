import type { ItemPredicate } from 'sandstone/generated/data/advancement/predicate'
import type { Dispatcher } from 'sandstone/generated/dispatcher'
import type { Registry } from 'sandstone/generated/registry'
import type { Text } from 'sandstone/generated/util/text'
import type { DataComponentPatch } from 'sandstone/generated/world/component'
import type { NBTInt } from 'sandstone'

export type BlockEntity = {
    id?: Registry['minecraft:block_entity_type']
    x?: NBTInt
    y?: NBTInt
    z?: NBTInt
    /**
     * Unknown
     * 0 for regular block entities
     */
    keepPacked?: boolean
    components?: DataComponentPatch
}

export type BlockEntityData = ({
    [S in Extract<Registry['minecraft:block_entity_type'], string>]?: ({
        id: S
    } & (S extends keyof Dispatcher<'minecraft:block_entity'>
        ? Dispatcher<'minecraft:block_entity'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:block_entity_type']])

export type Lockable = {
    /**
     * Item predicate testing the item that a player has to be holding to open this container.
     */
    lock?: ItemPredicate
}

export type Nameable = {
    /**
     * The custom name of this block.
     */
    CustomName?: Text
}
