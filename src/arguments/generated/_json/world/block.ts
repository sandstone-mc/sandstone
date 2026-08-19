import type { JsonItemPredicate } from 'sandstone/arguments/generated/_json/data/advancement/predicate.ts'
import type { JsonSymbolBlockEntity } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonDataComponentPatch } from 'sandstone/arguments/generated/_json/world/component.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTInt } from 'sandstone'

export type JsonBlockEntity = {
  id?: JsonRegistry['minecraft:block_entity_type'],
  x?: (NBTInt | number),
  y?: (NBTInt | number),
  z?: (NBTInt | number),
  /**
   * Unknown
   * 0 for regular block entities
   */
  keepPacked?: boolean,
  components?: JsonDataComponentPatch,
}

export type JsonBlockEntityData = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:block_entity_type'], string>, string>]?: ({
    id: S,
  } & (S extends keyof JsonSymbolBlockEntity ? JsonSymbolBlockEntity[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:block_entity_type'], string>])>

export type JsonLockable = {
  /**
   * Item predicate testing the item that a player has to be holding to open this container.
   */
  lock?: JsonItemPredicate,
}

export type JsonNameable = {
  /**
   * The custom name of this block.
   */
  CustomName?: JsonText,
}
