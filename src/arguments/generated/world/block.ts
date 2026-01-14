import type { ItemPredicate } from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type { SymbolBlockEntity } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { DataComponentPatch } from 'sandstone/arguments/generated/world/component.ts'
import type { NBTInt } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'

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
  } & (S extends keyof SymbolBlockEntity ? SymbolBlockEntity[S] : RootNBT));
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
