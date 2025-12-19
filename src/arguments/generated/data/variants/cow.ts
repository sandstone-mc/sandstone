import type { SpawnPrioritySelectors } from 'sandstone/arguments/generated/data/variants.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'

export type CowModelType = ('normal' | 'cold' | 'warm')

export type CowVariant = ({
    /**
     * Value:
     *
     *  - Normal(`normal`)
     *  - Cold(`cold`)
     *  - Warm(`warm`)
     */
    model?: CowModelType
    /**
     * The cow texture to use for this variant.
     */
    asset_id: Registry['minecraft:texture']
} & SpawnPrioritySelectors)
