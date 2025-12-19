import type { SpawnPrioritySelectors } from 'sandstone/generated/data/variants'
import type { Registry } from 'sandstone/generated/registry'

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
