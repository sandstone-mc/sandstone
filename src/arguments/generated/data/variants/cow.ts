import type { SpawnPrioritySelectors } from 'sandstone/generated/data/variants'
import type { Registry } from 'sandstone/generated/registry'

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
