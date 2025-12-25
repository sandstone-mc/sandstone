import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants'
import type { Registry } from 'sandstone/arguments/generated/registry'

export type FrogVariant = ({
  /**
     * The frog texture to use for this variant.
     */
  asset_id: Registry['minecraft:texture']
} & SpawnPrioritySelectors)
