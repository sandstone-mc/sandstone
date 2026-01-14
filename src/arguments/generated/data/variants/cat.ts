import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'

export type CatVariant = ({
  /**
   * The cat texture to use for this variant.
   */
  asset_id: Registry['minecraft:texture']
  /**
   * The baby cat texture to use for this variant.
   */
  baby_asset_id: Registry['minecraft:texture']
} & SpawnPrioritySelectors)
