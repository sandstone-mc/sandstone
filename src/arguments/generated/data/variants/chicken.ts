import type { SpawnPrioritySelectors } from 'sandstone/generated/data/variants'
import type { Registry } from 'sandstone/generated/registry'

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
