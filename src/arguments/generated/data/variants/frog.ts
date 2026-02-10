import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { TextureClass } from 'sandstone'

export type FrogVariant = ({
  /**
   * The frog texture to use for this variant.
   */
  asset_id: (Registry['minecraft:texture'] | TextureClass),
} & SpawnPrioritySelectors)
