import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants'
import type { Registry } from 'sandstone/arguments/generated/registry'

export type ChickenModelType = ('normal' | 'cold')

export type ChickenVariant = ({
  /**
     * Value:
     *
     *  - Normal(`normal`)
     *  - Cold(`cold`)
     */
  model?: ChickenModelType
  /**
     * The chicken texture to use for this variant.
     */
  asset_id: Registry['minecraft:texture']
} & SpawnPrioritySelectors)
