import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'

export type PigModelType = ('normal' | 'cold')

export type PigVariant = ({
  /**
     * Value:
     *
     *  - Normal(`normal`)
     *  - Cold(`cold`)
     */
  model?: PigModelType
  /**
     * The pig texture to use for this variant.
     */
  asset_id: Registry['minecraft:texture']
} & SpawnPrioritySelectors)
